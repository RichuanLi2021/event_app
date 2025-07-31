import { Request, Response, NextFunction } from "express";
import { BookingModel } from "./bookings.model";
import { EventModel } from "../events/models/event.model"; // Import your Event model
import { BookingStatus } from "./bookings.type";

export async function bookEventForUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?._id;
    const eventId = req.params.eventId;

    // Fetch event title
    const event = await EventModel.findById(eventId).select("title");
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // Optionally: check if already booked
    const existing = await BookingModel.findOne({ eventId, userId });
    if (existing) {
      res.status(409).json({ message: "Already booked" });
      return;
    }

    const booking = await BookingModel.create({
      userId,
      eventId,
      eventTitle: event.title,
      status: BookingStatus.Booked
    });
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
}