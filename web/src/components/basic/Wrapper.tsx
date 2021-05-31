import React from "react";
import styles from "../styles/wrapper.module.scss";
export type WrapperVariant = "small" | "regular";

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: WrapperVariant;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
  ...attributes
}) => {   
  return <div className={`${attributes.className} ${styles.wrapper} ${variant === 'regular' ? null : styles.wrapperSmall}`}>{children}</div>;
};
