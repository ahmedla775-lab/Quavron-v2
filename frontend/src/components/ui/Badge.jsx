const variants = {
  primary: "bg-blue-600/20 text-blue-400 border-blue-500/30",
  success: "bg-emerald-600/20 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-600/20 text-amber-400 border-amber-500/30",
  danger: "bg-red-600/20 text-red-400 border-red-500/30",
  purple: "bg-violet-600/20 text-violet-400 border-violet-500/30",
};

export default function Badge({
  children,
  variant = "primary",
  className = "",
}) {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-3
        py-1
        text-xs
        font-semibold
        uppercase
        tracking-wide
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

