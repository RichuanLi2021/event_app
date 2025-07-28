import { api } from "~/api/central-axios";
import type { CreateEventBody, DeletedEvent, Events, TheEvent, UpdateAnEvent, UpdatedEvent, UserEvents } from "../types";

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "~/api/axiosBaseQuery";

// Added client-caching for two main endpoints
export const eventsCacheApi = createApi({
  reducerPath: "eventsCacheApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Events", "UserEvents"],
  endpoints: (build) => ({
    /** GET /events  -> cached under 'Events/LIST' */
    listEvents: build.query<Events, void>({
      query: () => ({ url: "/events", method: "GET" }),
      providesTags: [{ type: "Events", id: "LIST" }],
    }),

    /** GET /events/user/:id  -> cached per‑user */
    listEventsByUser: build.query<UserEvents, string>({
      query: (usrId) => ({ url: `/events/user/${usrId}`, method: "GET" }),
      providesTags: (_r, _e, usrId) => [{ type: "UserEvents", id: usrId }],
    }),
  }),
});

// export async function fetchAllEvents(): Promise<Events> {
//     try {
//         const { data } = await api.get<Events>("/events");
//         return data;
//     } catch (err: any) {
//         const status = err.response?.status ?? "network";
//         throw new Error(`Fetch events failed (${status})`);
//     }
// }

// export async function fetchAllEventsByUsrId(usrId: string): Promise<UserEvents> {
//     try {
//         const url = `/events/user/${usrId}`;
//         console.log("fetchAllEventsByUsrId -> ", url);
//         const { data } = await api.get<UserEvents>(`/events/user/${usrId}`);
//         return data;
//     } catch (err: any) {
//         const status = err.response?.status ?? "network";
//         throw new Error(`Fetch events failed (${status})`);
//     }
// } 

export async function fetchEventById(id: string): Promise<TheEvent> {
    try{
        const { data } = await api.get<TheEvent>(`/events/${id}`);
        return data;
    } catch (err: any) {
        const status = err.response?.status ?? "network";
        throw new Error(`Fetch event: "${id}" failed (${status})`);
    }
}

export async function fetchEventByCategory(categoryName: string): Promise<Events> {
    try {
        const { data } = await api.get<Events>(`/events/categories/${categoryName}`);
        return data;
    } catch (err: any) {
        const status = err.response?.status ?? "network";
        throw new Error(`Fetch events from: "${categoryName}" failed (${status})`);
    }
} 

// Organizer
export async function createEvent(CreateEventPayload: CreateEventBody): Promise<TheEvent> {
    try{
        const { data } = await api.post(`/categories/${CreateEventPayload.category}/${CreateEventPayload.title}`, CreateEventPayload);
        return data;
    } catch (err: any) {
        const status = err.response?.status ?? "network";
        throw new Error(`Create event: ${CreateEventPayload.title} under "${CreateEventPayload.category}" failed (${status})`);
    }
}

// Orgainzer
export async function updateEvent(UpdateEventFieldsBody: UpdateAnEvent): Promise<UpdatedEvent> {
    try {
        const { data } = await api.put(`/events/${UpdateEventFieldsBody._id}`, UpdateEventFieldsBody.updateFields);
        return data;
    } catch (err: any) {
        const status = err.response?.status ?? "network";
        throw new Error(`Update event failed (${status}). \n
            id: ${UpdateEventFieldsBody._id}; title: ${UpdateEventFieldsBody.updateFields.title}`);
    }
}

export async function deleteEvent(id: string): Promise<DeletedEvent> {
    try {
        const { data } = await api.delete(`/events/${id}`);
        return data;
    } catch (err: any) {
        const status = err.response?.status ?? "network";
        throw new Error(`Failed to delete event: (${status}) \n
            id: ${id}`);
    }
}

// Admin

// Auto‑generated hooks for React components
export const {
  useListEventsQuery,
  useListEventsByUserQuery,
} = eventsCacheApi;