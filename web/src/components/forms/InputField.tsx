import { useField } from "formik";
import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import styles from "../styles/forms.module.scss";
import { FormControl } from "./FormControl";
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
  return (<div className={styles.formWrap}>  
    
    <FormControl isInvalid={!!error} className={`formRow ${styles.formControl}`}>
      
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
    </FormControl>
    {error ? <span className={styles.validationError}>{error}</span> : null}
    </div>
  );
};
