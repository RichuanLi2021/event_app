import { Document, Types } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  phone: string,
  password: string;
  role: 'USER' | 'ORGANIZER' | 'ADMIN';
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}
export interface AuthticatedUser {
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: 'USER' | 'ORGANIZER' | 'ADMIN';
    status: 'Active' | 'Inactive';
    createdAt: Date;
  };
  token: string;
  refreshToken: string
}

export interface SignupUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'USER' | 'ORGANIZER' | 'ADMIN';
  receiveUpdates?: boolean;
}
export type SigninUser = Pick<User, 'email' | 'password'>;

export type LeanUser = User & { _id: Types.ObjectId };

export type Role = AuthticatedUser['user']['role'];
export type VerifyRole = Role;

export type UserUpdateInput = Partial<{
  name: string;
  email: string;
  phone: string;
}>;


