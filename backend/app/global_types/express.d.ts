import type { User } from "../features/users/types/user.type";

// express global declaration
declare global {
  namespace Express {
    interface AuthPayload {
      id: string;
      role: User['role'];
    }
    interface Request {
      user?: AuthPayload;
    }
  }
}

export {};