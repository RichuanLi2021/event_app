import {EventModel} from "./models/event.model";
import { UpdateQuery } from "mongoose";
import { CreateAndUpdateEventInput, LeanEvent } from "./types/event.type";

export class EventService {
  // public
  static async getAll() {
    return await EventModel.find().sort({ createdAt: -1 }).exec();
  }

  static async getByCategory(category: string) {
    return await EventModel.find({ category }).exec();
  }

  static async getOne(id: string) {
    return await EventModel.findById(id).exec();
  }

  // organizer
  static async createEvent(data: CreateAndUpdateEventInput): Promise<LeanEvent> {
    const { title, category, date, location, costs } = data;
    if (!title || !category || !date || !location || !costs) {
      throw new Error(
        "Missing required fields: title, category, date, location, and costs are mandatory."
      );
    }
    const created = await EventModel.create(data);
    return created.toObject() as LeanEvent;
  }

  static async update(
    id: string,
    patch: UpdateQuery<CreateAndUpdateEventInput>
  ): Promise<LeanEvent | null> {
    return EventModel.findByIdAndUpdate(id, patch, {
        new: true,
        runValidators: true
      })
      .lean()
      .exec() as Promise<LeanEvent | null>;
  }

  static async deleteOne(id: string) {
    return await EventModel.findByIdAndDelete(id).exec();
  }

  static async deleteMany(ids: string[]) {
    return await EventModel.deleteMany({ _id: { $in: ids } }).exec();
  }

  // admin
  static async audit(id: string, status: "APPROVED" | "REJECTED") {
    return await EventModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }
}