import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      error,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">

        {label && (
          <label
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--q-text)" }}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={`
            w-full
            rounded-xl
            px-4
            py-3
            outline-none
            transition-all
            duration-200
            ${className}
          `}
          style={{
            background: "var(--q-card)",
            color: "var(--q-text)",
            border: "1px solid var(--q-border)",
          }}
          {...props}
        />

        {error && (
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--q-danger)" }}
          >
            {error}
          </p>
        )}

      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
