import { Router } from "express";
import authRouter from "./features/auth/routes/auth.routes";
import {userRouter, adminRouter } from "./features/users/routes/user.routes";
import { adminEventRouter, organizerEventRouter, publicEventRouter } from "./features/events/event.route";
// import eventRouter from "./features/events/controllers/"

const apiRouter = Router();
apiRouter.use('/auth', authRouter);

apiRouter.use('/users', userRouter);
apiRouter.use('/admin/users', adminRouter);

apiRouter.use('/events', publicEventRouter);
apiRouter.use('/events', organizerEventRouter);
apiRouter.use('/admin/events', adminEventRouter);

export default apiRouter;