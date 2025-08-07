import { Request, Response, NextFunction } from "express";
import { BookingModel } from "./bookings.model";
import { EventModel } from "../events/models/event.model"; // Import your Event model
import { BookingStatus } from "./bookings.type";
import { UserModel } from "../users/models/user.model";
import { validateObjectId } from "../../utils/validation";

/**
 * @swagger
 * /bookings/{eventId}:
 *   post:
 *     summary: Book an event
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID to book
 *     responses:
 *       201:
 *         description: Event booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid event ID or user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Event or user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Event already booked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function bookEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?._id;
    const eventId = req.params.eventId;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    // Validate event ID
    const validEventId = validateObjectId(eventId);
    if (!validEventId) {
      res.status(400).json({ message: "Invalid event ID format" });
      return;
    }

    // Validate user ID
    const validUserId = validateObjectId(userId);
    if (!validUserId) {
      res.status(400).json({ message: "Invalid user ID format" });
      return;
    }

    // Fetch event title
    const event = await EventModel.findById(validEventId).select("title");
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // Fetch user name
    const userName = await UserModel.findById(validUserId).select("name");
    if (!userName) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const existBooking = await BookingModel.findOne({ eventId: validEventId, userId: validUserId });
    if (existBooking && existBooking.status === 'BOOKED') {
      res.status(409).json({ message: "Already booked" });
      return;
    }

    const booking = await BookingModel.create({
      userId: validUserId,
      userName,
      eventId: validEventId,
      eventTitle: event.title,
      status: BookingStatus.Booked
    });
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
}

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get user's bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       401:
 *         description: User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function getUserBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?._id;
    const bookings = await BookingModel.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
}