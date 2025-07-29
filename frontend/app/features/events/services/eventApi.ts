import { api } from "~/api/central-axios";
import type { CreateEventBody, DeletedEvent, Events, TheEvent, UpdateAnEvent, UpdatedEvent, UserEvents } from "../types";

export async function fetchAllEvents(): Promise<Events> {
    try {
        const { data } = await api.get<Events>("/events");
        return data;
    } catch (err: any) {
        const status = err.response?.status ?? "network";
        throw new Error(`Fetch events failed (${status})`);
    }
}

export async function fetchAllEventsByUsrId(usrId: string): Promise<UserEvents> {
    try {
        const url = `/events/user/${usrId}`;
        console.log("fetchAllEventsByUsrId -> ", url);
        const { data } = await api.get<UserEvents>(`/events/user/${usrId}`);
        return data;
    } catch (err: any) {
        const status = err.response?.status ?? "network";
        throw new Error(`Fetch events failed (${status})`);
    }
} 

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
        console.log('Creating event with payload:', CreateEventPayload);
        const { data } = await api.post(`events/categories/${CreateEventPayload.category}/${CreateEventPayload.title}`, CreateEventPayload);
        return data;
    } catch (err: any) {
        const status = err.response?.status ?? "network";
        console.error('Create event error:', err.response?.data || err.message);
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