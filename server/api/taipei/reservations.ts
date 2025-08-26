import dayjs from "dayjs";
import { parentChildCenters } from "~/services/taipei/data";
import {
  cookReservation,
  fetchReservation,
} from "~/services/taipei/reservation";

const DATE_FORMAT = "YYYY/MM/DD";

function getDateFromShortcut(shortcut: string) {
  const today = dayjs();
  let saturday = today.day(6);
  if (saturday.isBefore(today, "day")) {
    saturday = saturday.add(7, "day");
  }
  const sunday = saturday.add(1, "day");
  const nextSaturday = saturday.add(7, "day");
  const nextSunday = nextSaturday.add(1, "day");
  switch (shortcut) {
    case "today":
      return today.format(DATE_FORMAT);
    case "tomorrow":
      return today.add(1, "day").format(DATE_FORMAT);
    case "this-weekend-sat":
      return saturday.format(DATE_FORMAT);
    case "this-weekend-sun":
      return sunday.format(DATE_FORMAT);
    case "next-weekend-sat":
      return nextSaturday.format(DATE_FORMAT);
    case "next-weekend-sub":
      return nextSunday.format(DATE_FORMAT);
  }
}

/**
 * ?date=YYYY/MM/DD
 * ?shortcut=today
 * ?shortcut=tomorrow
 * ?shortcut=this-weekend-sat
 * ?shortcut=this-weekend-sun
 * ?shortcut=next-weekend-sat
 * ?shortcut=next-weekend-sun
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  let date = (query.date as string) ?? dayjs().format(DATE_FORMAT);
  const shortcut = query.shortcut as string;
  if (shortcut) {
    date = getDateFromShortcut(shortcut) ?? date;
  }
  const parentChildCenterAreas = parentChildCenters
    .map((x) => x.areas.map((y) => ({ ...x, areas: undefined, area: y })))
    .flat();

  return Promise.all(
    parentChildCenterAreas.map((x) =>
      fetchReservation(date, { id: x.id, areaId: x.area.id })
        .then((y) =>
          y ? cookReservation(y, { date_YYYYYSlashMMSlashDD: date }) : null
        )
        .then((y) =>
          (y?.timeSlots ?? []).map((z) => ({
            ...x,
            ...z,
          }))
        )
    )
  )
    .then((x) => x.flat())
    .then((x) => x.filter((y) => y.amount > 0));
});
