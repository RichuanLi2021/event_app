import { useState } from "react";
import { Button} from "react-bootstrap";
import { EventModal } from "./EventModal";
import { Formik, Form as FormikForm} from 'formik';
import type { CreateEventProps } from "../../types";
import { CreateAnEventFormValidationSchema } from "../../formValidation";
import { EventFormFields } from "./CreateEventFormFields";

export const CreateEvent = ({ onAdd }: CreateEventProps) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button 
        variant="primary"
        style={{ backgroundColor: '#f05537', borderColor: '#f05537'}} 
        onClick={() => setShowModal(true)}>
        <i className="bi bi-plus-circle" />
        Create Event
      </Button>
      <Formik
        initialValues={{
          title: "",
          imageUrl: "",
          description: "",
          category: "",
          date: "",
          location: "",
          capacity: "",
          costs: "",
        }}
        validationSchema={CreateAnEventFormValidationSchema}
        onSubmit={(
          values, 
          {setSubmitting, resetForm}) => {
          const capacity = values.capacity ? Number(values.capacity) : undefined;
          if (!capacity || capacity <= 0) {
            console.error('Capacity must be a positive number');
            return;
          }
          
          onAdd({
              title: values.title.trim(),
              imageUrl: values.imageUrl.trim(),
              description: values.description.trim(),
              category: values.category,
              date: new Date(values.date),
              costs: values.costs.trim(),
              capacity: capacity,
              location: values.location.trim()
          });
          resetForm();
          setSubmitting(false);
          setShowModal(false);
        }}
      >
        {({handleSubmit, isSubmitting, resetForm}) => (
          <EventModal
            show={showModal}
            onClose={() => {
              resetForm();
              setShowModal(false)
            }}
            onSubmit={
              () => handleSubmit()
            }
            title="Create new event"
            submitLabel="Create"
            isSubmitting = {isSubmitting}

          >
            <FormikForm id="event-form" noValidate>
              <EventFormFields/>
            </FormikForm>
          </EventModal>
        )}
      </Formik>
    </>
  );
};