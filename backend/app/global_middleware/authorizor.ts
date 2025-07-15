import { Request, Response, NextFunction, RequestHandler } from "express";
import { VerifyRole } from "../features/users/types/user.type";

export function authorize(...roles: VerifyRole[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    if (!roles.includes(req.user.role as VerifyRole)) {
      res.status(403).json(
        { message: `Forbidden: you cannot request resources 
          beyond the level of your access: [${req.user.role}]` 
      });
      return;
    }
    next();
  };
}

export function allowSelfOrAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
    // admin has access to user profile temporary
  if (req.user?.role === 'ADMIN' || req.user?.id === req.params.id) {
    return next();
  }
  res.status(403).json({ message: 'Forbidden' });
}