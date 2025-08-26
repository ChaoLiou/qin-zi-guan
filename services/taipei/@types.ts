export type ParentChildCenterArea = { id: number; text: string };

export type ParentChildCenter = {
  id: number;
  text: string;
  areas: ParentChildCenterArea[];
  coords: { longitude: number; latitude: number };
};

export type Reservation = {
  timeSlots: {
    amount: number;
    startsAt: Date;
    endsAt: Date;
  }[];
};

export type ParentChildCenterReservation = (Omit<ParentChildCenter, "areas"> &
  Reservation["timeSlots"][number]) & {
  area: ParentChildCenterArea;
};

export type Event = {
  title: string;
  eventStartsAt: Date;
  eventEndsAt: Date;
  signUpStartsAt: Date;
  signUpEndsAt: Date;
  totalAmount: number;
  ageRangeFrom: number;
  ageRangeTo: number;
  amount: number;
};
