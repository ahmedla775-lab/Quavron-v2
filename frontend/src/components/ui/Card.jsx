export default function Card({
  children,
  className = "",
  hover = true,
}) {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-slate-800
        bg-slate-900/70
        backdrop-blur-md
        p-6
        shadow-lg
        transition-all
        duration-300
        ${
          hover
            ? "hover:-translate-y-1 hover:border-blue-500 hover:shadow-blue-500/20"
            : ""
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}

