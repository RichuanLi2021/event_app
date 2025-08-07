import { Router } from "express";
import * as bookingController from "./booking.controller";
import { authenticate } from "../../global_middleware/authenticator";

const userBookingRouter = Router();

userBookingRouter.post("/:eventId", authenticate, bookingController.bookEvent);
userBookingRouter.get("/", authenticate, bookingController.getUserBookings);

export default userBookingRouter;