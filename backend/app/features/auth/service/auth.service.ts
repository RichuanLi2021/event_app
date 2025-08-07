import { parsedEnv } from "../../../config/env";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthticatedUser, LeanUser, SigninUser, SignupUser } from "../../users/types/user.type";
import { UserModel } from "../../users/models/user.model";
import { RevokedTokenModel } from "../models/revokedToken.model";

export class AuthService {
    // signup
    static async register(data: SignupUser) 
    {
        const hashPassword = await bcrypt.hash(data.password, 12);

        if (data.name?.trim() === '') delete (data as any).name;
        
        const user = await UserModel.create({ 
            ...data, 
            password: 
            hashPassword, 
            status: "Active" 
        });
        const { _id, name, email, phone, role, status } = user.toObject() as LeanUser;
        const registered_User = { 
                    _id: _id.toString(), 
                    name, 
                    email,
                    phone, 
                    role,
                    status 
                }
        return registered_User;
    }

    // login
    static async login(
        {email, password}: SigninUser
    ): Promise<AuthticatedUser> {
        const user = await UserModel
            .findOne({ email })
            .select("+password")
            .lean<LeanUser>();

        console.log("user is: ", user); // log user entity

        if (!user) throw new Error("Invalid credentials");

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) throw new Error("Invalid credentials");

        const { _id, name, email: userEmail, phone, role, status, createdAt } = user;

        const accessToken = this.signToken(user); 
        const refreshToken = this.refreshToken(user);

        return {
            user: { 
                _id: _id.toString(), 
                name, 
                email, 
                phone, 
                role, 
                status, 
                createdAt 
            }, 
            token: accessToken,
            refreshToken
        };
    }

    static async logout(refreshToken: string): Promise<void> {
      if (!refreshToken || !parsedEnv.JWT_REFRESH_SECRET) return;

      try {
        const { exp } = jwt.verify(
          refreshToken,
          parsedEnv.JWT_REFRESH_SECRET
        ) as jwt.JwtPayload;

        const expiryDate = exp ? new Date(exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const res = await RevokedTokenModel.updateOne(
          { token: refreshToken },
          { token: refreshToken, expiresAt: expiryDate },
          { upsert: true }
        );
        console.log('logout → revoked update result', res); 
      } catch(err) {
        console.error('logout error', err);
      }
    }

    // reset password
    static async resetPassword(email: string) {
        
    }

    private static signToken(user: LeanUser): string {
        if (!parsedEnv.JWT_SECRET) throw new Error("Jwt tokwn is missing!");
        const payload = { sub: user._id, role: user.role, type: "access-jwt"};
        const token = jwt.sign(payload, parsedEnv.JWT_SECRET, { 
            expiresIn: "10m",
            issuer: "event-flow-server",
            audience: `event-flow-client-${user.name}`
        });
        return token;
    }

    private static refreshToken(user: LeanUser): string {
        if (!parsedEnv.JWT_REFRESH_SECRET) throw new Error("Refresh token is missing!");
        const payload = { sub: user._id, role: user.role, type: "refresh-jwt" };
        const refresh_token = jwt.sign(payload, parsedEnv.JWT_REFRESH_SECRET, {
            expiresIn: "7d",
            issuer: "event-flow-server",
                audience: `event-flow-client-${user.name}`
        });
        return refresh_token;
    }

    static async rotateAccessToken(refreshToken: string): Promise<string> {
        if (!parsedEnv.JWT_REFRESH_SECRET) {
            throw new Error("JWT_REFRESH_SECRET is not set");
        }

        let payload: jwt.JwtPayload;
        try {
            payload = jwt.verify(refreshToken, parsedEnv.JWT_REFRESH_SECRET) as jwt.JwtPayload;
        } catch {
            throw new Error("Invalid or expired refresh token");
        }

        // Check blacklist
        const revoked = await RevokedTokenModel.exists({ token: refreshToken });
        if (revoked) {
          throw new Error("Refresh token has been revoked");
        }

        if (payload.type !== "refresh-jwt") {
            throw new Error("Wrong token type");
        }

        const user = await UserModel.findById(payload.sub).lean<LeanUser>();
        if (!user) throw new Error("User not found");

        return this.signToken(user);
    }
}