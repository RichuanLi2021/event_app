import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { Formik, Form as FormikForm } from 'formik';
import type { CreateEventBody, EventDetailsModalProps } from "~/features/events/types";
import { EventFormFields } from "./CreateEventFormFields";
import { DeleteEventModal } from "./DeleteEventModal";

export const EventDetailsModal = ({
  show,
  onHide,
  event,
  onUpdate,
  onDelete,
  isAdmin = false,
  userRole = 'USER',
}: EventDetailsModalProps & { isAdmin?: boolean }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (event) {
      setIsEditing(false);
    }
  }, [event?._id, event?.organizer_id]);

  if (!event) return null;

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Edit button clicked for event: ${event._id} created by: ${event.organizer_id}`);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = (values: any) => {
    console.log('Form submitted with values:', values);
    const capacity = values.capacity ? Number(values.capacity) : undefined;
    if (!capacity || capacity <= 0) {
      console.error('Capacity must be a positive number');
      return;
    }

    const toUpdateEvent: CreateEventBody = {
      title: values.title.trim(),
      imageUrl: values.imageUrl.trim(),
      description: values.description.trim(),
      category: values.category,
      date: new Date(values.date),
      costs: values.costs.trim(),
      capacity: capacity,
      location: values.location.trim()
    };

    console.log('Dispatching update for event:', event._id);
    onUpdate(event._id, toUpdateEvent);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    onDelete(event._id);
    setShowDeleteModal(false);
    onHide();
  };

  const handleClose = () => {
    console.log('Modal closing, resetting edit state');
    setIsEditing(false);
    onHide();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Edit Event" : "Event Details"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isEditing ? (
            <Formik
              key={event._id}
              initialValues={{
                title: event.title || "",
                imageUrl: event.imageUrl || "",
                description: event.description || "",
                category: event.category || "",
                date: event.date ? new Date(event.date).toISOString().split('T')[0] : "",
                location: event.location || "",
                capacity: event.capacity?.toString() || "",
                costs: event.costs || "",
              }}
              onSubmit={handleSave}
              enableReinitialize={false}
            >
              {({ handleSubmit, isSubmitting }) => (
                <FormikForm id="event-edit-form" noValidate onSubmit={handleSubmit}>
                  <EventFormFields />
                </FormikForm>
              )}
            </Formik>
          ) : (
            <div>
              <div className="mb-3">
                <strong>Title:</strong> {event.title}
              </div>
              {event.imageUrl && (
                <div className="mb-3">
                  <strong>Image URL:</strong> {event.imageUrl}
                </div>
              )}
              {event.description && (
                <div className="mb-3">
                  <strong>Description:</strong> {event.description}
                </div>
              )}
              <div className="mb-3">
                <strong>Category:</strong> {event.category}
              </div>
              <div className="mb-3">
                <strong>Date:</strong> {event.date ? new Date(event.date).toLocaleDateString() : 'No date'}
              </div>
              <div className="mb-3">
                <strong>Location:</strong> {event.location}
              </div>
              {event.capacity && (
                <div className="mb-3">
                  <strong>Capacity:</strong> {event.capacity}
                </div>
              )}
              <div className="mb-3">
                <strong>Costs:</strong> {event.costs}
              </div>
              <div className="mb-3">
                <strong>Status:</strong> {event.status}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {isEditing ? (
            <>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                variant="success" 
                type="submit" 
                form="event-edit-form"
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" type="button" onClick={handleClose}>
                Close
              </Button>
              {/* Only organizers can edit and delete events */}
              {userRole === 'ORGANIZER' && (
                <>
                  <Button 
                    variant="primary" 
                    type="button" 
                    onClick={handleEdit}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    Edit
                  </Button>
                  <Button variant="danger" type="button" onClick={handleDelete}>
                    Delete
                  </Button>
                </>
              )}
            </>
          )}
        </Modal.Footer>
      </Modal>

      <DeleteEventModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        eventTitle={event.title}
      />
    </>
  );
}; 