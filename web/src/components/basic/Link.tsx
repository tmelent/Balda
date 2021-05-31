import React from "react";
import { forwardRef } from "react";

interface LinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  isLoading?: boolean;
  href?: any;
}
export const Link: React.FC<LinkProps> = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ isLoading = false, children, href, onClick }, ref) => {    
    return !isLoading ? (
      <a href={href} onClick={onClick} ref={ref}>{children}</a>
    ) : (
      <a>Loading...</a>
    );
  }
);
