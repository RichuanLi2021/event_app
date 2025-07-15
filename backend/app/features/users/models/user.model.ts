import { Schema, model } from 'mongoose';
import { User } from '../types/user.type';

const UserSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: false,
      unique: true,
      sparse: true
    },
    email:  { 
      type: String, 
      required: true, 
      unique: true 
    },
    password:{ 
      type: String, 
      required: true,
      select: false
    },
    role: { 
      type: String, 
      enum: ['USER','ORGANIZER','ADMIN'], 
      default: 'USER' 
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: null
    }
  },
  { timestamps: true }
);

export const UserModel = model<User>('User', UserSchema);