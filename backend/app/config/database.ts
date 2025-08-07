import { parsedEnv } from './env';
import mongoose from 'mongoose';
import { UserModel } from '../features/users/models/user.model';

export default async function connectDB(
    url: string = parsedEnv.MONGO_URI
): Promise<void> {
  await mongoose.connect(url);
  await UserModel.syncIndexes();
  console.log('✓ MongoDB connected');
}