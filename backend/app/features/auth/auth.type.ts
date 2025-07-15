import { Types, Document } from "mongoose";

export interface RevokedToken extends Document {
    token: string,
    expiresAt: Date,
}