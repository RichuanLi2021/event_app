import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import {EventModel} from "./models/event.model";    
import type { LeanUser } from "../users/types/user.type";
import { EventService } from "./event.service";
import { CreateEventInput, UpdateEventInput } from "./types/event.type";

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
  req: Request<{ id: string, updateFields: UpdateEventInput}>,
  res: Response,
  next: NextFunction
) {
  try {
    const updated = await EventModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return next(createHttpError(404, "Event not found"));
    res.status(200).json(updated);
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
  req: Request<{ id: string }, unknown, { status: "APPROVED" | "REJECTED" }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { status } = req.body;
    if (!["APPROVED", "REJECTED"].includes(status))
      return next(createHttpError(400, "Invalid status"));

    const event = await EventModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!event) return next(createHttpError(404, "Event not found"));
    res.status(200).json(event);
  } catch (err) {
    next(createHttpError(500, "Failed to audit event"));
  }
}

