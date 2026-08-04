const variants = {

  primary:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",

  success:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",

  warning:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",

  danger:
    "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",

  purple:
    "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30",

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
        transition-colors
        ${variants[variant]}
        ${className}
      `}

    >

      {children}

    </span>

  );

}
