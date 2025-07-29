import {EventModel} from "./models/event.model";
import { Types, UpdateQuery } from "mongoose";
import { CreateEventInput, UpdateEventInput, LeanEvent } from "./types/event.type";

export class EventService {
  // public
  static async getAll() {
    const events = await EventModel.find().sort({ createdAt: -1 }).exec();
    console.log(`Loaded Events: ${events}`)
    return events;
  }

  static async getAllByUsrId(userId: string) {
    const usrEvents = await EventModel.find({ 
      organizer_id: new Types.ObjectId(userId)
      })
      .populate("organizer_id", "name")
      .lean()
      .exec();
    return usrEvents
  }

  static async getByCategory(category: string) {
    return await EventModel.find({ category }).exec();
  }

  static async getOne(id: string) {
    return await EventModel.findById(id).exec();
  }

  // organizer
  static async createEvent(data: CreateEventInput & { organizer_id: Types.ObjectId }): Promise<LeanEvent> {
    const { title, category, description, date, location, capacity, costs } = data;
    
    if (!title || !category || !description || !date || !location || !capacity || !costs) {
      const missingFields = [];
      if (!title) missingFields.push('title');
      if (!category) missingFields.push('category');
      if (!description) missingFields.push('description');
      if (!date) missingFields.push('date');
      if (!location) missingFields.push('location');
      if (!capacity) missingFields.push('capacity');
      if (!costs) missingFields.push('costs');
      
      console.error(`Missing required fields: ${missingFields.join(', ')}`);
      throw new Error(
        `Missing required fields: ${missingFields.join(', ')} are mandatory.`
      );
    }
    const created = await EventModel.create(data);
    return created.toObject() as LeanEvent;
  }

  static async updateEvent(
    id: string,
    patch: UpdateQuery<UpdateEventInput>
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