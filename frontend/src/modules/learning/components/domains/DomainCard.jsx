export default function DomainCard({

  title = "Programming",

  description = "Software development, web, mobile, AI and computer science.",

}) {

  return (

    <article
      className="rounded-3xl border p-6 transition hover:shadow-lg"
      style={{
        background: "var(--q-surface)",
        borderColor: "var(--q-border)",
      }}
    >

      <h3
        className="text-2xl font-bold"
        style={{
          color: "var(--q-text)",
        }}
      >
        {title}
      </h3>

      <p
        className="mt-4"
        style={{
          color: "var(--q-muted)",
        }}
      >
        {description}
      </p>

    </article>

  );

}
