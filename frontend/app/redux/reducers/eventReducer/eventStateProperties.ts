import type { Events, TheEvent, UpdateEventStatus, UserEvents } from "~/features/events/types";

export interface EventState {
  events: Events;
  selectedEvent: TheEvent | null; // TO-DO: Check the necessarality of the existence.
  currentUserEvents: UserEvents | []; // This has already contained all properties of events, updates also reflect here.
  updatedEventStatus: UpdateEventStatus | null; // TO-DO: Check the necessarality of the existences.
  loading: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
}

export const initialEventState: EventState = {
  events: [],
  selectedEvent: null,
  currentUserEvents: [],
  updatedEventStatus: null,
  loading: false,
  updating: false,
  deleting: false,
  error: null
};