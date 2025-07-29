import { Form } from "react-bootstrap";
import { useField } from "formik";
import type { EventFieldInputProps, EventSelectInputProps } from "../../types";

export const EventFormTextInput = ({
  label,
  textarea = false,
  rows = 3,
  type = "text",
  placeholder,
  ...rest
}: EventFieldInputProps) => {
  const [field, meta] = useField<string>(rest);
  const isInvalid = Boolean(meta.touched && meta.error);
  return (
    <Form.Group controlId={field.name} className="mb-3">
      <Form.Label>{label}</Form.Label>
      {textarea ? (
        <Form.Control
          {...field}
          as="textarea"
          rows={rows}
          placeholder={placeholder}
          isInvalid={isInvalid}
        />
      ) : (
        <Form.Control
          {...field}
          type={type}
          placeholder={placeholder}
          isInvalid={isInvalid}
        />
      )}
      <Form.Control.Feedback type="invalid">
        {typeof meta.error === 'string' ? meta.error : 'Invalid input'}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export const EventFormSelectInput = ({
  label,
  options,
  groupedOptions,
  placeholder = "Select…",
  ...rest
}: EventSelectInputProps & { groupedOptions?: { label: string; options: [string, string][] }[] }) => {
  const [field, meta] = useField<string>(rest);
  const isInvalid = Boolean(meta.touched && meta.error);

  return (
    <Form.Group controlId={field.name} className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Select
        {...field} 
        id={field.name}
        aria-label={label}
        isInvalid={isInvalid}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {groupedOptions
          ? groupedOptions.map(group => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map(([value, text]) => (
                  <option key={value} value={value}>
                    {text}
                  </option>
                ))}
              </optgroup>
            ))
          : options!.map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">
        {typeof meta.error === 'string' ? meta.error : 'Invalid input'}
      </Form.Control.Feedback>
    </Form.Group>
  );
};