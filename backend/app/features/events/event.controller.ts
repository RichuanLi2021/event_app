import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import {EventModel} from "./models/event.model";    
import type { LeanUser } from "../users/types/user.type";
import { EventService } from "./event.service";
import { AdminUpdateEventStatus, CreateEventInput, UpdateEventInput, UpdateEventStatus } from "./types/event.type";

// GET http://localhost:5174/api/events
export async function getAllEvents(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const events = await EventService.getAll();
    res.status(200).json(events);
  } catch (err) {
    next(createHttpError(500, "Failed to fetch events"));
  }
}

// GET http://localhost:5174/api/events/user/:userId
export async function getAllEventsByUserId(
  _req: Request<{ userId: string}>,
  res: Response,
  next: NextFunction
) {
  try {
    const userEvents = await EventService.getAllByUsrId(_req.params.userId);
    if(!userEvents || userEvents.length === 0) {
      console.log("No relevant events found with the provided user ID.")
      res.status(200).send([]);
      return;
    }
    console.log(`User: ${_req.params.userId} has the following events: \n
      ${userEvents}`);
    res.status(200).json(userEvents);
  } catch (err) {
    console.log("Fetching events for", _req.params.userId);
    next(createHttpError(500, "Failed to fetch events"))
  }
}

// GET http://localhost:5174/api/events/categories/:categoryName
export async function getEventsByCategory(
  req: Request<{ categoryName: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const events = await EventService.getByCategory(req.params.categoryName);
    res.status(200).json(events);
  } catch (err) {
    
    next(createHttpError(500, "Failed to fetch events by category"));
  }
}

// GET http://localhost:5174/api/events/:id
export async function getEventById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const event = await EventService.getOne(req.params.id);
    if (!event) return next(createHttpError(404, "Event not found"));
    res.status(200).json(event);
  } catch (err) {
    next(createHttpError(500, "Failed to fetch event"));
  }
}

// GET http://localhost:5174/api/events/search?q=query&location=location
export async function searchEvents(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = req.query.q as string;
    const location = req.query.location as string;
    
    if (!query && !location) {
      res.status(200).json([]);
      return;
    }
    
    const events = await EventService.searchEvents(query || "", location);
    res.status(200).json(events);
  } catch (err) {
    next(createHttpError(500, "Failed to search events"));
  }
}

// POST http://localhost:5174/api/events/categories/:category/:eventName
export async function createEventByCategory(
  req: Request<
    { category: string; eventName: string }, 
    unknown,
    CreateEventInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const organizer = (req.user as LeanUser)._id;
    const body = req.body as CreateEventInput;

    if (!body.date) body.date = new Date();

    const input = {
      ...body,
      category: req.params.category,
      title: req.params.eventName,
      organizer_id: organizer
    };

    const newEvent = await EventService.createEvent(input);
    res.status(201).json(newEvent);
  } catch (err) {
    console.error('Create event failed →', err); 
    next(createHttpError(400, "Failed to create event"));
  }
}

// PUT http://localhost:5174/api/events/:id
export async function updateEvent(
  req: Request<{ id: string }, any, UpdateEventInput | UpdateEventStatus>,
  res: Response,
  next: NextFunction
) {
  try {
    const updatedEvent = await EventService.updateEvent(req.params.id, req.body);
    if (!updatedEvent) {
      return next(createHttpError(404, "Event not found"));
    }
    res.status(200).json(updatedEvent);
  } catch (err) {
    next(createHttpError(400, "Failed to update event"));
  }
}

// DELETE http://localhost:5174/api/events/:id
export async function deleteEventById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const removed = await EventModel.findByIdAndDelete(req.params.id);
    if (!removed) return next(createHttpError(404, "Event not found"));
    res.status(204).end();
  } catch (err) {
    next(createHttpError(500, "Failed to delete event"));
  }
}

// DELETE http://localhost:5174/api/events/  (ids in body: { ids: string[] })
export async function deleteManyEvents(
  req: Request<unknown, unknown, { ids: string[] }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0)
      return next(createHttpError(400, "ids array required"));
    await EventModel.deleteMany({ _id: { $in: ids } });
    res.status(204).end();
  } catch (err) {
    next(createHttpError(500, "Failed to delete events"));
  }
}

// PATCH http://localhost:5174/api/admin/events/:id/audit   { status: "APPROVED" | "REJECTED" }
export async function auditEvent(
  req: Request<{ id: string }, unknown, AdminUpdateEventStatus>,
  res: Response,
  next: NextFunction
) {
  try {
    const adminUpdateEventStatus = await EventService.updateEvent(req.params.id, req.body);
    if (!adminUpdateEventStatus) {
      return next(createHttpError(400, "Invalid status"));
    }
    res.status(200).json(adminUpdateEventStatus);
  } catch (err) {
    next(createHttpError(500, "Failed to audit event"));
  }
}

