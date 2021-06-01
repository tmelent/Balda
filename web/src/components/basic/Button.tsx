import React from "react";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  href?: any;
}
export const Button: React.FC<ButtonProps> = ({
  isLoading = false,
  children,
  onClick,
  ...props
}) => {
  return !isLoading ? (
    <button {...props} onClick={onClick} type="submit">
      {children}
    </button>
  ) : (
    <button {...props} onClick={onClick} type="submit">
      Загрузка...
    </button>
  );
};
