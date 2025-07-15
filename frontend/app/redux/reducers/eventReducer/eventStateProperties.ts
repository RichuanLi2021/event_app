import type { EventProperties } from "~/types/events";

export interface EventState {
    events: EventProperties[];
    loading: boolean;
    error: string | null;
}