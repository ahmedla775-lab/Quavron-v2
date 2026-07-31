import { forwardRef } from "react";

const variants = {
  primary: {
    background: "var(--q-primary)",
    color: "#fff",
    border: "1px solid var(--q-primary)",
  },

  secondary: {
    background: "var(--q-surface)",
    color: "var(--q-text)",
    border: "1px solid var(--q-border)",
  },

  outline: {
    background: "transparent",
    color: "var(--q-primary)",
    border: "1px solid var(--q-primary)",
  },

  success: {
    background: "var(--q-success)",
    color: "#fff",
    border: "1px solid var(--q-success)",
  },

  danger: {
    background: "var(--q-danger)",
    color: "#fff",
    border: "1px solid var(--q-danger)",
  },

  ghost: {
    background: "transparent",
    color: "var(--q-text)",
    border: "1px solid transparent",
  },
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-12 px-7 text-lg",
};

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className = "",
      disabled = false,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        style={variants[variant]}
        className={`
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          font-semibold
          transition-all
          duration-200
          active:scale-95
          hover:opacity-90
          disabled:opacity-50
          disabled:cursor-not-allowed
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
