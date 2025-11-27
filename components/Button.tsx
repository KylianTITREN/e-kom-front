import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger";
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "px-8 py-3 font-sans font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide text-sm uppercase";
  
  const variantStyles = {
    primary: "bg-primary text-background-light border border-primary hover:bg-primary-dark hover:border-primary-dark",
    secondary: "bg-accent text-white border border-accent hover:bg-accent-dark hover:border-accent-dark",
    outline: "bg-transparent text-primary border border-primary hover:bg-primary hover:text-background-light",
    danger: "bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
