import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthService } from "../service/auth.service";
import { signupSchema, signinSchema } from "../../../zodSchema";
import { parsedEnv } from "../../../config/env";

// POST / – signup a account
export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const validateReqBody = signupSchema.parse(req.body);
    const user = await AuthService.register(validateReqBody);
    res.status(201).json(user);
  } catch (err) { next(err); }
}

// POST / – signin account
export async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    const {email, password} = signinSchema.parse(req.body);
    const { user, token, refreshToken } = await AuthService.login({ email, password });
    
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: parsedEnv.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ user, token });
  } catch (err) { next(err); }
}

// POST / - get new access token
export const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const refresh_token = req.cookies?.refresh_token;
    console.log("refresh token is: ", refresh_token);
    // Test-only: remove this later on...
    console.log("⇢ refresh-token endpoint hit → cookie:", refresh_token?.slice(0, 30) ?? "NONE");

    if (!refresh_token) {
      res.status(401).json({ message: "Missing refresh token" });
      return;
    }
    const newAccessToken = await AuthService.rotateAccessToken(refresh_token);
    res.json({ token: newAccessToken });
  } catch (err) { next(err); }
}

// POST /auth/logout – invalidate refresh token and clear cookie
export const logout: RequestHandler = async (req, res, next) => {
  try {
    const refresh_token = req.cookies?.refresh_token;
    if (refresh_token) {
      await AuthService.logout(refresh_token);
    }
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: parsedEnv.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// POST / – reset password
export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    // to be done when sms is setup
  } catch (err) { next(err); }
}