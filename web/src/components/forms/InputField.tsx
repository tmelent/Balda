import { useField } from "formik";
import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import styles from "../styles/forms.module.scss";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  textarea,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    // <FormControl isInvalid={!!error}>
    //   <FormLabel htmlFor={field.name}>{label}</FormLabel>
    //   <InputOrTextarea {...field} {...props} id={field.name} />
    //   {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    // </FormControl>
    <div className={`formRow ${styles.form}`}>
      <label htmlFor={field.name} className={styles.label}>{label}</label>
      {textarea ? (
        <textarea
          {...field}
          {...(props as DetailedHTMLProps<
            TextareaHTMLAttributes<HTMLTextAreaElement>,
            HTMLTextAreaElement
          >)}
          id={field.name}
        />
      ) : (
        <input className={`${styles.formInput}`} {...field} {...props} id={field.name} />
      )}
    </div>
  );
};
