import { Button, Modal } from "react-bootstrap";
import type { EventModalProps } from "../../types";

export const EventModal = ({
    show,
    onClose,
    title,
    children,
    submitLabel = "Save",
    isSubmitting = false,
}: EventModalProps) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title || "Modal"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    close
                </Button>
                <Button variant="primary" type="submit" form="create-event-form" disabled={isSubmitting}>
                    {submitLabel}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};