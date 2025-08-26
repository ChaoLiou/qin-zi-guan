import * as cheerio from "cheerio";
import type { Event } from "./@types";

export type RawEvent = {
  title: string;
  eventAt: string;
  signUpAt: string;
  totalAmount: string;
  eventObject: string;
  detailHref: string;
  amount: string;
};

export const fetchEvents = async (guanId: number): Promise<RawEvent[]> => {
  const headers = new Headers();
  headers.append(
    "Content-Type",
    "application/x-www-form-urlencoded; charset=UTF-8"
  );
  try {
    const response = await fetch(
      "https://welfare.gov.taipei/Kids/ParentChild/ParentChildActivity_A_01",
      {
        method: "post",
        headers,
        body: `pfid=${guanId}&cate=0`,
      }
    );
    const htmlContent = await response.text();
    return getEventsFromHtmlContent(htmlContent);
  } catch (error) {
    console.log(error);
  }
  return [];
};

const getEventsFromHtmlContent = (htmlContent: string): RawEvent[] => {
  const $ = cheerio.load(htmlContent);
  return $(".p-gray.mb-4.bgc-gray.p-4")
    .map(function () {
      return {
        title: $(".title-pink", this).text().trim(),
        eventAt: $(
          ".row > .col-lg-5.col-md-7 > .d-flex:nth-child(1) > div:nth-child(2)",
          this
        )
          .text()
          .trim(),
        signUpAt: $(
          ".row > .col-lg-5.col-md-7 > .d-flex:nth-child(2) > div:nth-child(2)",
          this
        )
          .text()
          .trim(),
        totalAmount: $(".row > .col-lg-4.col-md-5 > span:nth-child(2)", this)
          .text()
          .trim(),
        eventObject: $(".row > .col-lg-4.col-md-5 > span:nth-child(5)", this)
          .text()
          .trim(),
        detailHref:
          $(
            ".row > .col-lg-3.col-md-12.mt-3.mt-lg-0 > .row > div:nth-child(1) > a",
            this
          )
            .attr("href")
            ?.trim() ?? "",
        amount: $(
          ".row > .col-lg-3.col-md-12.mt-3.mt-lg-0 > .row > div:nth-child(2) > .d-flex > span > .text-info",
          this
        )
          .text()
          .trim(),
      };
    })
    .toArray();
};

const CH_TO_EN_NUMBER_MAP: Record<string, number> = {
  零: 0,
  一: 1,
  二: 2,
  兩: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10,
};

function getEnNumberFromCh(number_ch: string | undefined): number {
  const ten_ch = "十";
  if (!number_ch) return 0;
  if (number_ch.length === 1) return CH_TO_EN_NUMBER_MAP[number_ch] ?? 0;
  if (number_ch.startsWith(ten_ch) /** e.g. 十一, 十二, ... */)
    return 10 + (CH_TO_EN_NUMBER_MAP[number_ch[1]] ?? 0);
  if (number_ch.endsWith(ten_ch) /** e.g. 二十, 三十, ... */)
    return (CH_TO_EN_NUMBER_MAP[number_ch[0]] ?? 1) * 10;
  if (number_ch.includes(ten_ch) /** e.g. 二十一, 三十二, ... */) {
    const [a, b] = number_ch.split(ten_ch);
    return (CH_TO_EN_NUMBER_MAP[a] ?? 1) * 10 + (CH_TO_EN_NUMBER_MAP[b] ?? 0);
  }
  return (
    Number([...number_ch].map((c) => CH_TO_EN_NUMBER_MAP[c] ?? "").join("")) ||
    0
  );
}

function getEnAgeFromCh(age_ch: string): number {
  if (age_ch.includes("大人")) return -1;
  if (age_ch.includes("學齡前")) return 72;

  const regex = /(?:(\D+)歲)?(?:(\D+)個月)?/;
  const match = age_ch.match(regex);
  if (!match) return -1;

  const years = getEnNumberFromCh(match[1]);
  const months = getEnNumberFromCh(match[2]);
  return years * 12 + months;
}

export const cookEvent = (rawEvent: RawEvent): Event => {
  const [, eventDate, eventStartTime, eventEndTime] =
    /^(\d{4}\/\d{2}\/\d{2}).*?(\d{2}:\d{2})\s~\s(\d{2}:\d{2})$/.exec(
      rawEvent.eventAt
    ) ?? [];

  const [signUpStart_str, signUpEnd_str] = rawEvent.signUpAt.split(" ~ ");
  const [totalAmount_str = "0"] = /^\d+/.exec(rawEvent.totalAmount) ?? [];
  const [amount_str = "0"] = /^\d+/.exec(rawEvent.amount) ?? [];
  const [ageRangeFrom_str, ageRangeTo_str] = rawEvent.eventObject
    .split("~")
    .map((s) => s.replace("滿", "").replace("未滿", "").trim());

  return {
    title: rawEvent.title,
    eventStartsAt: new Date(`${eventDate} ${eventStartTime}`),
    eventEndsAt: new Date(`${eventDate} ${eventEndTime}`),
    signUpStartsAt: new Date(signUpStart_str),
    signUpEndsAt: new Date(signUpEnd_str),
    totalAmount: parseInt(totalAmount_str, 10),
    ageRangeFrom: getEnAgeFromCh(ageRangeFrom_str),
    ageRangeTo: getEnAgeFromCh(ageRangeTo_str),
    amount: parseInt(amount_str || "0", 10),
  };
};
