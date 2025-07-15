import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authenticate } from "../../../global_middleware/authenticator";
import { authorize, allowSelfOrAdmin } from "../../../global_middleware/authorizor";
import { ADMIN_ROLE, USER_ROLES } from "../roles";

const userRouter = Router();
const adminRouter = Router();

userRouter.use(authenticate, authorize(...USER_ROLES));

// user & organizer or Admin
userRouter.route('/:id')
          .get(userController.getUser)
          .put(userController.updateUser)
          .delete(userController.deleteUser)

// Admin
adminRouter.use(authenticate, allowSelfOrAdmin);
adminRouter.use(authorize(...ADMIN_ROLE));

adminRouter.route('/')
           .get(userController.getALL)
           .delete(userController.deleteSomeUsers)

export {userRouter, adminRouter};
