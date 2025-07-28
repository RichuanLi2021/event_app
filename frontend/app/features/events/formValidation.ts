import * as Yup from 'yup';
import { EventCategory } from './types';

export const CreateAnEventFormValidationSchema = Yup.object({
    title: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Must be 50 characters or less')
        .required('Title is required'),
    imageUrl: Yup.string()
        .url('Must be a valid URL')
        .required('Image URL is required'),
    description: Yup.string()
        .min(15, "You've gotta write something!")
        .required('Description is required'),
    date: Yup.date()
        .typeError('Invalid date')
        .min(new Date(), 'Date must be in the future')
        .required('Date is required'),
    location: Yup.string()
        .min(2, 'Location is too short')
        .required('Location is required'),
    capacity: Yup.number()
        .typeError('Capacity must be a number')
        .integer('Capacity must be an integer')
        .positive('Capacity must be greater than 0')
        .nullable()
        .notRequired(),
    category: Yup.mixed<EventCategory>()
        .oneOf(Object.values(EventCategory) as EventCategory[], 'Invalid category'),
    costs: Yup.string()
        .typeError('Costs must be a number')
        .required('Costs are required'),
});