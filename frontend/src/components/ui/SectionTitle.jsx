export default function SectionTitle({
  badge,
  title,
  subtitle,
  align = "center",
}) {
  const alignment = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={`mb-16 ${alignment[align]}`}>

      {badge && (
        <span className="inline-block rounded-full border border-blue-500/30 bg-blue-600/20 px-4 py-1 text-sm font-semibold text-blue-400">
          {badge}
        </span>
      )}

      <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-400">
          {subtitle}
        </p>
      )}

    </div>
  );
}

