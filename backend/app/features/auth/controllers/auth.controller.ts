import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthService } from "../service/auth.service";
import { signupSchema, signinSchema } from "../../../zodSchema";
import { parsedEnv } from "../../../config/env";

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupUser'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST / – signup a account
export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const validateReqBody = signupSchema.parse(req.body);
    const user = await AuthService.register(validateReqBody);
    res.status(201).json(user);
  } catch (err) { next(err); }
}

/**
 * @swagger
 * /auth/sign-in:
 *   post:
 *     summary: Sign in to user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SigninUser'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticatedUser'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
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

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Get new access token using refresh token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: New access token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: New access token
 *       401:
 *         description: Invalid or missing refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user and invalidate refresh token
 *     tags: [Authentication]
 *     responses:
 *       204:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password (SMS setup required)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Password reset initiated
 *       400:
 *         description: Invalid email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST / – reset password
export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    // to be done when sms is setup
  } catch (err) { next(err); }
}