import { Router } from "express";
import { authenticate } from "../../global_middleware/authenticator";
import * as userBookingController from "./booking.controller"

export const userBookingRouter = Router();
userBookingRouter.use(authenticate);

userBookingRouter.put('/:id', userBookingController.userBooking);





