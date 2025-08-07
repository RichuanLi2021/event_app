import { Request, Response, NextFunction } from "express";
import { BookingModel } from "./bookings.model";
import { EventModel } from "../events/models/event.model"; // Import your Event model
import { BookingStatus } from "./bookings.type";
import { UserModel } from "../users/models/user.model";
import { validateObjectId } from "../../utils/validation";

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

export async function getUserBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?._id;
    const bookings = await BookingModel.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
}