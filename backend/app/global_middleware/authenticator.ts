import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const authenticate: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "No token found" });
    return;
  }

  try {
    const payload = jwt.verify( token, env.JWT_SECRET ) as { 
      sub: string; 
      role: string 
    };
    req.user = { 
      id: payload.sub, 
      role: payload.role as any 
    };
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}