import { Router } from "express";
import * as eventController from "./event.controller";
import { authenticate } from "../../global_middleware/authenticator";
import { authorize } from "../../global_middleware/authorizor";
import { ORGANIZER_ROLE, ADMIN_ROLE} from "../users/roles";

const publicEventRouter  = Router(); // user access needed
publicEventRouter.use(authenticate);

// public
publicEventRouter.get("/", eventController.getAllEvents); // all events from all categories
publicEventRouter.get("/categories/:categoryName", eventController.getEventsByCategory);
publicEventRouter.get("/:id", eventController.getEventById);

// Organizer
const organizerEventRouter = Router();
organizerEventRouter.use(authenticate, authorize(...ORGANIZER_ROLE));

organizerEventRouter
  .post("/categories/:category/:eventName", eventController.createEventByCategory);
organizerEventRouter.route("/:id")
  .put(eventController.updateEvent)
  .delete(eventController.deleteEventById);

// Admin
const adminEventRouter = Router();
adminEventRouter.use(authenticate, authorize(...ADMIN_ROLE));

adminEventRouter.patch("/:id/audit", eventController.auditEvent);

export { publicEventRouter, organizerEventRouter, adminEventRouter };