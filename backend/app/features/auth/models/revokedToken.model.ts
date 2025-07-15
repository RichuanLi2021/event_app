import { Schema, model } from "mongoose";
import { RevokedToken } from "../auth.type";

const RevokedTokenSchema = new Schema<RevokedToken>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// TTL index: MongoDB will remove the doc automatically once expiresAt passes.
RevokedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RevokedTokenModel = model<RevokedToken>("RevokedToken", RevokedTokenSchema);