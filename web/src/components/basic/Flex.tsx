import * as React from "react";
import styles from "../styles/flex.module.scss";
interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  directionRow?: boolean;
}
export const Flex: React.FC<FlexProps> = ({
  directionRow = true,
  children,
  ...attributes
}) => {
  return (
    <div
      className={`${attributes.className} ${styles.flex} ${
        directionRow ? null : styles.flexColumn
      }`}
    >
      {children}
    </div>
  );
};
