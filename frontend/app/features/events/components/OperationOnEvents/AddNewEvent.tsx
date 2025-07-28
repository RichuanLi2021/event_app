// import { useState } from "react";
// import { Button} from "react-bootstrap";
// import { EventModal } from "./EventModal";
// import { Formik, Form as FormikForm} from 'formik';
// import type { CreateEventProps } from "../../types";
// import { CreateAnEventFormValidationSchema } from "../../formValidation";
// import { EventFormFields } from "./CreateEventFormFields";

// export const AddProduct = ({ onAdd }: CreateEventProps) => {
//   const [showModal, setShowModal] = useState(false);
//   return (
//     <>
//       <Button variant="primary" onClick={() => setShowModal(true)}>
//         <i className="bi bi-plus-circle me-2" />
//         Add Product
//       </Button>

//       <Formik
//         initialValues={{
//           title: "",
//           imageUrl: "",
//           description: "",
//           category: null,
//           date: null,
//           location: "",
//           capacity: "",
//           price: "",
//         }}
//         validationSchema={CreateAnEventFormValidationSchema}
//         onSubmit={(
//           values, 
//           {setSubmitting, resetForm}) => {
//           onAdd({
//               title: values.title.trim(),
//               imageUrl: values.imageUrl.trim(),
//               description: values.description.trim(),
//               category: values.category,
//               date: 
//               costs: values.price.trim(),
//               location: ""
//           });
//           resetForm();
//           setSubmitting(false);
//           setShowModal(false);
//         }}
//       >
//         {({handleSubmit, isSubmitting, resetForm}) => (
//           <EventModal
//             show={showModal}
//             onClose={() => {
//               resetForm();
//               setShowModal(false)
//             }}
//             onSubmit={() => handleSubmit()}
//             title="Add New Product"
//             submitLabel="Add Product"
//             isSubmitting = {isSubmitting}
//             initialValues={{
//               name: "",
//               banner: "",
//               description: "",
//               price: 0,
//             }}
//           >
//             <FormikForm id="product-form" noValidate>
//               <EventFormFields  />
//             </FormikForm>
//           </EventModal>
//         )}
//       </Formik>
//     </>
//   );
// };