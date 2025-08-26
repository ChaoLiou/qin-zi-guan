import { parentChildCenters } from "~/services/taipei/data";
import { fetchEvents, cookEvent } from "~/services/taipei/event";

/**
 * ?raw=true
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const onlyRaw = JSON.parse((query.raw ?? "false") as string);

  return Promise.all(
    parentChildCenters.map(async (item) => {
      const events = await fetchEvents(item.id);
      return {
        ...item,
        events: onlyRaw ? events : events.map(cookEvent),
      };
    })
  );
});
