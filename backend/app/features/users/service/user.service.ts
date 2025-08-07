import { User } from "../types/user.type";
import { UserModel } from "../models/user.model";
import { UserUpdateInput } from "../types/user.type";
import { date } from "zod";
import { validateObjectId, validateObjectIds } from "../../../utils/validation";

const SAFE_PROJECTION = '-password -__v';

export class UserService {
    // get a single user's profile
    static async getOne(userId: string): Promise<User | null> {
        const validUserId = validateObjectId(userId);
        if (!validUserId) {
            throw new Error("Invalid user ID format");
        }
        
        try {
            return UserModel.findById(validUserId).select(SAFE_PROJECTION).lean();
        } catch(error) {
            throw new Error(`Invalid User ID ${error}`);
        }
    }

      /** Get all users – for admin dashboard (supports optional filter/pagination) */
    static async getAll(
        filter: Partial<Pick<User, 'role'>> = {},
        opts: { limit?: number; skip?: number } = {}
    ) {
        const { limit = 50, skip = 0 } = opts;
        const [data, total] = await Promise.all([
        UserModel.find(filter).select(SAFE_PROJECTION).limit(limit).skip(skip).lean(),
        UserModel.countDocuments(filter)
        ]);
        return { total, skip, limit, data };
    }

    // User or Admin can update
    static async updateOne(userId: string, data: UserUpdateInput) {
      const validUserId = validateObjectId(userId);
      if (!validUserId) {
        throw new Error("Invalid user ID format");
      }
      
      try {
        const updated = await UserModel.findByIdAndUpdate(
          validUserId,
          { $set: data },
          {
            new: true,
            runValidators: true,
          }
        )
          .select(SAFE_PROJECTION)
          .lean();

        console.log(
          `User ${userId} updated: \n`,
          Object.keys(data).length ? data : '(no changes)'
        );

        return updated;
      } catch (err: any) {
        console.error('Update failed', err.message);
        throw err;
      }
    }

    // Delete -- Incomplete
    static async deleteOne(userId: string): Promise<boolean> {
        const validUserId = validateObjectId(userId);
        if (!validUserId) {
            throw new Error("Invalid user ID format");
        }
        
        const res = await UserModel.deleteOne({ _id: validUserId });
        return res.deletedCount === 1;
    }

    // Group delete -- Admin only
    static async deleteSome(ids: string[]) {
        const validIds = validateObjectIds(ids);
        if (validIds.length === 0) {
            throw new Error("No valid user IDs provided");
        }
        
        const res = await UserModel.deleteMany({ _id: { $in: validIds } });
        return { deleted: res.deletedCount ?? 0 };
    }
}