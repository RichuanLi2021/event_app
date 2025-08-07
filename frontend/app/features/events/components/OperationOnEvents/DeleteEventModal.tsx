import { Button, Modal } from "react-bootstrap";
import type { DeleteEventModalProps } from "~/features/events/types";

export const DeleteEventModal = ({
  show,
  onHide,
  onConfirm,
  eventTitle,
}: DeleteEventModalProps) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete <b>{eventTitle}</b>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          No
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Yes, Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}; 