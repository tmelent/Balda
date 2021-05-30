import React from "react";
import { forwardRef } from "react";

interface LinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  isLoading?: boolean;
}
export const Link: React.FC<LinkProps> = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ isLoading, children, ...attributes }, ref) => {    
    return isLoading ? (
      <a ref={ref} {...attributes}>{children}</a>
    ) : (
      <a {...attributes}>Loading...</a>
    );
  }
);
