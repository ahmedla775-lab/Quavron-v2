export default function CourseCard({

  title = "Introduction to Programming",

  instructor = "Quavron Academy",

  category = "Programming",

  level = "Beginner",

  lessons = 12,

  free = true,

}) {

  return (

    <article
      className="rounded-3xl border p-6 transition hover:shadow-lg"
      style={{
        background: "var(--q-surface)",
        borderColor: "var(--q-border)",
      }}
    >

      <div className="flex items-center justify-between">

        <span
          className="rounded-full px-3 py-1 text-sm"
          style={{
            background: "var(--q-primary)",
            color: "white",
          }}
        >
          {category}
        </span>

        <span
          style={{
            color: "var(--q-muted)",
          }}
        >
          {free ? "Free" : "Premium"}
        </span>

      </div>

      <h3
        className="mt-5 text-2xl font-bold"
        style={{
          color: "var(--q-text)",
        }}
      >
        {title}
      </h3>

      <p
        className="mt-3"
        style={{
          color: "var(--q-muted)",
        }}
      >
        {instructor}
      </p>

      <div
        className="mt-6 flex items-center justify-between"
        style={{
          color: "var(--q-muted)",
        }}
      >
        <span>{level}</span>

        <span>{lessons} Lessons</span>

      </div>

    </article>

  );

}
