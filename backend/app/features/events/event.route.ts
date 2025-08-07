import { Router } from "express";
import * as eventController from "./event.controller";
import { authenticate } from "../../global_middleware/authenticator";
import { authorize } from "../../global_middleware/authorizor";
import { ORGANIZER_ROLE, ADMIN_ROLE} from "../users/roles";

const publicEventRouter = Router();

const privateEventRouter = Router();
privateEventRouter.use(authenticate);

// public
publicEventRouter.get("/", eventController.getAllEvents);
publicEventRouter.get("/search", eventController.searchEvents);
publicEventRouter.get("/categories/:categoryName", eventController.getEventsByCategory);

// private
privateEventRouter.get("/user/:userId", eventController.getAllEventsByUserId);
privateEventRouter.get("/:id", eventController.getEventById);

// Organizer
const organizerEventRouter = Router();
organizerEventRouter
  .use(authenticate, authorize(...ORGANIZER_ROLE));
organizerEventRouter
  .post("/categories/:category/:eventName", eventController.createEventByCategory);
organizerEventRouter
  .route("/:id")
  .put(eventController.updateEvent)
  .delete(eventController.deleteEventById);

// Admin
const adminEventRouter = Router();
adminEventRouter.use(authenticate, authorize(...ADMIN_ROLE));

adminEventRouter.patch("/:id/audit", eventController.auditEvent);

export { publicEventRouter, privateEventRouter, organizerEventRouter, adminEventRouter };