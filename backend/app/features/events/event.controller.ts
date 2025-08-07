import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import {EventModel} from "./models/event.model";    
import type { LeanUser } from "../users/types/user.type";
import { EventService } from "./event.service";
import { AdminUpdateEventStatus, CreateEventInput, UpdateEventInput, UpdateEventStatus } from "./types/event.type";

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter events by category
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, CANCELLED]
 *         description: Filter events by status
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /events/user/{userId}:
 *   get:
 *     summary: Get all events by user ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /events/categories/{categoryName}:
 *   get:
 *     summary: Get events by category
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: categoryName
 *         required: true
 *         schema:
 *           type: string
 *         description: Event category name
 *     responses:
 *       200:
 *         description: Events by category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /events/search:
 *   get:
 *     summary: Search events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid search parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /events/categories/{category}/{eventName}:
 *   post:
 *     summary: Create a new event (Organizer only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Event category
 *       - in: path
 *         name: eventName
 *         required: true
 *         schema:
 *           type: string
 *         description: Event name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventInput'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Organizer access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update event (Organizer only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/UpdateEventInput'
 *               - $ref: '#/components/schemas/UpdateEventStatus'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Organizer access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete event (Organizer only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       204:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Organizer access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// DELETE http://localhost:5174/api/events/:id
export async function deleteEventById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const removed = await EventService.deleteOne(req.params.id);
    if (!removed) return next(createHttpError(404, "Event not found"));
    res.status(204).end();
  } catch (err) {
    next(createHttpError(500, "Failed to delete event"));
  }
}

/**
 * @swagger
 * /events:
 *   delete:
 *     summary: Delete multiple events (Organizer only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of event IDs to delete
 *     responses:
 *       204:
 *         description: Events deleted successfully
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Organizer access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
    await EventService.deleteMany(ids);
    res.status(204).end();
  } catch (err) {
    next(createHttpError(500, "Failed to delete events"));
  }
}

/**
 * @swagger
 * /admin/events/{id}/audit:
 *   patch:
 *     summary: Audit event (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminUpdateEventStatus'
 *     responses:
 *       200:
 *         description: Event audited successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

