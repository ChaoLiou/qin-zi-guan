import dayjs from "dayjs";
import type { Reservation } from "./@types";

export type RawReservation = {
  TimeList: {
    startTime: string;
    endTime: string;
    weekDay: number;
    reservationStr: string;
    MorningCnt: number;
    AfternoonCnt: number;
    Notice: unknown;
  }[];
  Remark: string;
};

export const fetchReservation = async (
  date_YYYYYSlashMMSlashDD: string,
  parentChildCenter: { id: number; areaId: number }
): Promise<RawReservation | null> => {
  const headers = new Headers();
  headers.append(
    "Content-Type",
    "application/x-www-form-urlencoded; charset=UTF-8"
  );
  try {
    const res = await fetch(
      "https://welfare.gov.taipei/Kids/ParentChild/GetDateDetail",
      {
        method: "post",
        headers,
        body: `selectDate=${date_YYYYYSlashMMSlashDD}&pfid=${parentChildCenter.id}&pfmid=${parentChildCenter.areaId}`,
      }
    );
    return await res.json();
  } catch (error) {
    console.error(error);
  }
  return null;
};

export const cookReservation = (
  rawReservation: RawReservation,
  options: { date_YYYYYSlashMMSlashDD: string }
): Reservation => {
  return {
    timeSlots: rawReservation.TimeList.map((x) => {
      const [, amount_str = "0"] = />(\d+)</.exec(x.reservationStr) ?? [];
      return {
        startsAt: dayjs(
          `${options.date_YYYYYSlashMMSlashDD} ${x.startTime}`
        ).toDate(),
        endsAt: dayjs(
          `${options.date_YYYYYSlashMMSlashDD} ${x.endTime}`
        ).toDate(),
        amount: parseInt(amount_str || "0", 10),
      };
    }),
  };
};
