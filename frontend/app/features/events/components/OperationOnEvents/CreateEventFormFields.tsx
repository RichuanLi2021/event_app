import { EventFormTextInput, EventFormSelectInput } from "./FieldsInput";
import { EventCategory } from '../../types';

const categoryOptions = Object
  .values(EventCategory)
  .map(category => [category, category]) as [string, string][];

export const EventFormFields = () => (
  <>
    <EventFormTextInput
      label="Event Title"
      name="title"
      textarea={true}
      placeholder="Enter event Title/Nmae"
    />
    <EventFormTextInput
      label="Event URL"
      name="imageUrl"
      textarea={true}
      placeholder="Enter image URL"
    />
    <EventFormTextInput
      label="Description"
      name="description"
      textarea={true}
      type="text"
      rows={3}
      placeholder="Enter event description"
    />
    <EventFormSelectInput
      label="Category"
      name="category"
      options={categoryOptions}
      placeholder="Choose a category"
    />
    <EventFormTextInput
      label="Date"
      name="date"
      type="date"
    />
    <EventFormTextInput
      label="Location"
      name="location"
      type="text"
      placeholder="Enter the location"
    />
    <EventFormTextInput
      label="Capacity"
      name="capacity"
      type="number"
      placeholder="Enter allowed capacity for your event"
    />
    <EventFormTextInput
      label="Costs"
      name="costs"
      type="text"
      placeholder="Enter the costs"
    />
  </>
);
