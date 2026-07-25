import { forwardRef } from "react";

const variants = {
  primary:
    "bg-blue-600 text-white lg:hover:bg-blue-700",

  secondary:
    "bg-slate-800 text-white border border-slate-700 lg:hover:bg-slate-700",

  outline:
    "border border-blue-600 text-blue-500 lg:hover:bg-blue-600 lg:hover:text-white",

  success:
    "bg-emerald-600 text-white lg:hover:bg-emerald-700",

  danger:
    "bg-red-600 text-white lg:hover:bg-red-700",

  ghost:
    "text-slate-300 lg:hover:bg-slate-800",
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
        className={`
          inline-flex
          items-center
          justify-center
          gap-2

          rounded-xl

          font-semibold
          whitespace-nowrap

          transition-all
          duration-200

          active:scale-95

          focus:outline-none
          focus:ring-2
          focus:ring-blue-500/50

          disabled:cursor-not-allowed
          disabled:opacity-50

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
