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

        <span
          className="
            inline-flex
            items-center
            rounded-full
            border
            border-blue-500/30
            bg-blue-500/10
            px-4
            py-1
            text-sm
            font-semibold
            text-blue-600
            dark:text-blue-400
          "
        >

          {badge}

        </span>

      )}



      <h2

        className="
          mt-4
          text-4xl
          font-bold
          text-[var(--q-text)]
          md:text-5xl
        "

      >

        {title}

      </h2>



      {subtitle && (

        <p

          className="
            mx-auto
            mt-5
            max-w-3xl
            text-lg
            text-[var(--q-muted)]
          "

        >

          {subtitle}

        </p>

      )}


    </div>

  );

}
