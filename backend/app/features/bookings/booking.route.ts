import { Router } from "express";
import { authenticate } from "../../global_middleware/authenticator";

export const userBookingRouter = Router();
userBookingRouter.use(authenticate);







