import { forwardRef } from "react";

const variants = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white",

  secondary:
    "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700",

  outline:
    "border border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white",

  success:
    "bg-emerald-600 hover:bg-emerald-700 text-white",

  danger:
    "bg-red-600 hover:bg-red-700 text-white",

  ghost:
    "hover:bg-slate-800 text-slate-300"
};

const sizes = {
  sm: "px-3 py-2 text-sm",

  md: "px-5 py-2.5 text-base",

  lg: "px-7 py-3 text-lg"
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
        className={`
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          font-semibold
          transition-all
          duration-300
          active:scale-95
          disabled:opacity-50
          disabled:cursor-not-allowed
          ${variants[variant]}
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

