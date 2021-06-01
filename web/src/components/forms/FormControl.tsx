import * as React from "react";
import { HTMLAttributes } from "react";
import styles from "../styles/formControl.module.scss";
interface FormControlProps extends HTMLAttributes<HTMLDivElement> {
  isInvalid: boolean;
}

export const FormControl: React.FC<FormControlProps> = (({ isInvalid, children, ...props }) => {
  return isInvalid ? (
    <div className={`${styles.invalid} ${props.className}`} >{children}</div>
  ) : (
    <div className={props.className}>{children}</div>
  );
});
