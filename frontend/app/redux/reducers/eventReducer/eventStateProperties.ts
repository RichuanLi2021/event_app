import type { Events, TheEvent, UserEvents } from "~/features/events/types";

export interface EventState {
  events: Events;
  selectedEvent: TheEvent | null;
  currentUserEvents: UserEvents | [];
  loading: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
}

export const initialEventState: EventState = {
  events: [],
  selectedEvent: null,
  currentUserEvents: [],
  loading: false,
  updating: false,
  deleting: false,
  error: null
};