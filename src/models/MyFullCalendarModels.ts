export interface Event {
  id: number;
  title: string;
  start: string;
  end: string | undefined;
  meta: any;
}

export interface Events extends Array<Event> {}

export interface MyFullCalendarProps {
  events: Events | undefined;
  date: string;
  loading: boolean;
}
