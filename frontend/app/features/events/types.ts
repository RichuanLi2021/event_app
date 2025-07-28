import { useField, type FieldHookConfig } from "formik";

export type SeatStatus = "available" | "vip" | "booked" | "selected";

export enum EventCategory {
  Music = 'Music',
  Sports = 'Sports',
  Career = 'Career',
  Dating = 'Dating',
  Theatre = 'Theatre',
  Culture = 'Culture',
  Technology = 'Technology',
  Education = 'Education',
  Business = 'Business',
  HealthWellness = 'Health & Wellness',
  FoodDrink = 'Food & Drink',
  International = 'International Events',
  Festival = 'Festival',
  Other = 'Other',
}

export const EVENT_CATEGORY_BY_KINDS = {
  COMMUNITY: [
    EventCategory.FoodDrink,
    EventCategory.Festival,
    EventCategory.HealthWellness,
    EventCategory.Music,
    EventCategory.Culture,
    EventCategory.Theatre,
    EventCategory.Sports,
    EventCategory.Dating,
    EventCategory.Other
  ],
  COLLEGE: [
    EventCategory.Career,
    EventCategory.Education,
    EventCategory.Dating,
    EventCategory.FoodDrink,
    EventCategory.Technology,
    EventCategory.Other
  ],
  INTERNATIONAL: [
    EventCategory.International,
    EventCategory.Festival
  ]
} as const;

export type CategoryKey = keyof typeof EVENT_CATEGORY_BY_KINDS;
export type CategoryForKinds<Kind extends CategoryKey> = typeof EVENT_CATEGORY_BY_KINDS[Kind][number];

export type EventsForCommunity = CategoryForKinds<'COMMUNITY'>;
export type EventsForCollege = CategoryForKinds<'COLLEGE'>;
export type EventsForInternational = CategoryForKinds<'INTERNATIONAL'>;

export const enum EventStatus {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  Cancelled = 'CANCELLED',

  Confirmed = 'CONFIRMED',
  Booked = 'BOOKED',
  Waitlisted = 'WAITLISTED',
}

export const EVENT_STATUS_BY_ROLE = {
  ADMIN: [
    EventStatus.Pending,
    EventStatus.Approved,
    EventStatus.Rejected,
  ],
  ORGANIZER: [
    EventStatus.Confirmed,
    EventStatus.Pending,
    EventStatus.Cancelled,
  ],
  USER: [
    EventStatus.Booked,
    EventStatus.Cancelled,
    EventStatus.Waitlisted,
  ],
} as const;

export type UserRole = keyof typeof EVENT_STATUS_BY_ROLE;

export type StatusForRole<Role extends UserRole> = typeof EVENT_STATUS_BY_ROLE[Role][number];

export type AdminEventStatus = StatusForRole<'ADMIN'>;
export type OrganizerEventStatus = StatusForRole<'ORGANIZER'>;
export type UserEventStatus = StatusForRole<'USER'>;

// Event type for master event collection
export interface TheEvent {
  _id: string,
  title: string;
  description?: string;
  imageUrl?: string;
  category: string;
  date: Date;
  location: string;
  capacity?: number;
  costs: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  organizer: string;
  createdAt: Date;
  updatedAt: Date
}

/** Organizer object as returned by the populated query */
export interface OrganizerLite {
  _id: string;
  name: string;
}

export interface UserEvent extends Omit<TheEvent, "id" | "organizer"> {
  _id: string;
  organizer_id: OrganizerLite;
  __v?: number;
}

export type UserEvents = UserEvent[];


// All events
export type Events = TheEvent[];

// Create
export type CreateEventBody = Omit<TheEvent, '_id' | 'createdAt' | 'updatedAt' | 'status' | 'organizer'>;
// Update
export type UpdateAnEvent = {
  _id: string,
  updateFields: Omit<TheEvent, '_id' | 'createdAt' | 'updatedAt' | 'organizer'>
};
export type UpdatedEvent = TheEvent;
export type UpdateEventFields = Pick<UpdateAnEvent, 'updateFields'>;

// Delete
export type DeletedEvent = Pick<TheEvent, '_id' | 'title'>;

export interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  onClick?: (title: string) => void;
} 

export interface EventFieldInputProps extends FieldHookConfig<string> {
  label: string;
  name: string;
  type?: "text" | "email" | "number" | "date";
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
}

export interface EventSelectInputProps extends FieldHookConfig<string> {
  label: string;
  options: [string, string][];
  placeholder?: string;
}

export interface EventModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (values: UpdateEventFields) => void;
  title?: string;
  children: React.ReactNode;
  submitLabel: string;
  isSubmitting?: boolean;
  initialValues: UpdateEventFields;
}

export interface CreateEventProps {
  onAdd: (newEvent: CreateEventBody) => void;
}

