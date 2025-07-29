import { api } from "~/api/central-axios";
import type { CreateEventBody, DeletedEvent, Events, TheEvent, UpdateAnEvent, UpdatedEvent, UpdateEventStatus, UserEvents } from "../types";

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

// Orgainzer - update event details or just change event status (Cancel or Auditing)
export async function updateEvent(updatePayload: UpdateAnEvent | UpdateEventStatus): Promise<UpdatedEvent> {
    try {
        const payload = 'updateFields' in updatePayload
            ? updatePayload.updateFields
            : {status: updatePayload.status};
        const { data } = await api.put<UpdatedEvent>(
            `/events/${updatePayload._id}`, payload);
        return data;
    } catch (err: any) {
        const status = err.response?.status ?? "network";
        const title = 'updateFields' in updatePayload 
            ? ` title: ${updatePayload.updateFields.title}` 
            : '';
        throw new Error(`Update event failed (${status}). \n
            id: ${updatePayload._id}; 
            title: ${title}`);
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