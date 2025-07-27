export type SideBarSection = 'User Information' | 'Event Bookings' | 'Calendar' | 'Chat Room' | 'Payment';

export interface ProfileMainContentProps {
  section: SideBarSection;
}

export interface User {
  _id: string,
  name: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ORGANIZER' |'ADMIN';
  status: 'Active' | 'Inactive';
  createdAt?: Date;
  updatedAt: Date;
  deleteAt: Date;
}

export interface UpdateAccountInfo {
  _id: string,
  updateFields: {
    name?: string;
    email?: string;
    phone?: string;
  }
}

export type UpdateAccountSuccessPayload = Omit<User, 'createdAt'>;

export type DeleteAccountSuccessPayload = Pick<User, '_id' | 'name' | 'role' | 'deleteAt'>
