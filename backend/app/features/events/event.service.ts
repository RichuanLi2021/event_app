import {EventModel} from "./models/event.model";
import { Types } from "mongoose";
import { CreateEventInput, UpdateEventInput, LeanEvent, UpdateEventStatus, AdminUpdateEventStatus } from "./types/event.type";
import { validateObjectId, validateObjectIds, sanitizeRegexString } from "../../utils/validation";

export class EventService {
  // public
  static async getAll() {
    const events = await EventModel.find().sort({ createdAt: -1 }).exec();
    console.log(`Loaded Events: ${events}`)
    return events;
  }

  static async getAllByUsrId(userId: string) {
    const validUserId = validateObjectId(userId);
    if (!validUserId) {
      throw new Error("Invalid user ID format");
    }
    
    const usrEvents = await EventModel.find({ 
      organizer_id: validUserId
      })
      .populate("organizer_id", "name")
      .lean()
      .exec();
    return usrEvents
  }

  static async getByCategory(category: string) {
    if (!category || typeof category !== 'string') {
      throw new Error("Invalid category parameter");
    }
    
    const sanitizedCategory = sanitizeRegexString(category);
    const categoryRegex = new RegExp(sanitizedCategory, 'i'); // case-insensitive search
    return await EventModel.find({ category: categoryRegex }).exec();
  }

  static async getOne(id: string) {
    const validId = validateObjectId(id);
    if (!validId) {
      throw new Error("Invalid event ID format");
    }
    return await EventModel.findById(validId).exec();
  }

  // search events
  static async searchEvents(query: string, location?: string) {
    if (!query || typeof query !== 'string') {
      throw new Error("Invalid search query");
    }
    
    const sanitizedQuery = sanitizeRegexString(query);
    const searchRegex = new RegExp(sanitizedQuery, 'i'); // case-insensitive search
    
    const searchQuery: any = {
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { location: searchRegex }
      ]
    };

    // Add location filter if provided
    if (location && location !== "All Locations" && typeof location === 'string') {
      const sanitizedLocation = sanitizeRegexString(location);
      searchQuery.location = new RegExp(sanitizedLocation, 'i');
    }

    return await EventModel.find(searchQuery).sort({ createdAt: -1 }).exec();
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
    patch: UpdateEventInput | UpdateEventStatus | AdminUpdateEventStatus
  ): Promise<LeanEvent | null> {
    const validId = validateObjectId(id);
    if (!validId) {
      throw new Error("Invalid event ID format");
    }
    
    // full event updates or status-only updates
    const updateCheck = typeof patch === 'string' ? {status: patch} : patch;
    return EventModel.findByIdAndUpdate(validId, updateCheck, {
        new: true,
        runValidators: true
      })
      .lean()
      .exec() as Promise<LeanEvent | null>;
  }

  static async deleteOne(id: string) {
    const validId = validateObjectId(id);
    if (!validId) {
      throw new Error("Invalid event ID format");
    }
    return await EventModel.findByIdAndDelete(validId).exec();
  }

  static async deleteMany(ids: string[]) {
    const validIds = validateObjectIds(ids);
    if (validIds.length === 0) {
      throw new Error("No valid event IDs provided");
    }
    return await EventModel.deleteMany({ _id: { $in: validIds } }).exec();
  }

  // admin
  static async audit(id: string, status: "APPROVED" | "REJECTED") {
    const validId = validateObjectId(id);
    if (!validId) {
      throw new Error("Invalid event ID format");
    }
    return await EventModel.findByIdAndUpdate(validId, { status }, { new: true }).exec();
  }
}