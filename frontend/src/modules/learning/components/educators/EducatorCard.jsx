export default function EducatorCard({

  name = "Quavron Academy",

  role = "Educator",

  specialization = "Programming",

}) {

  return (

    <article
      className="rounded-3xl border p-6"
      style={{
        background: "var(--q-surface)",
        borderColor: "var(--q-border)",
      }}
    >

      <div
        className="h-20 w-20 rounded-full"
        style={{
          background: "var(--q-primary)",
        }}
      />

      <h3
        className="mt-5 text-2xl font-bold"
        style={{
          color: "var(--q-text)",
        }}
      >
        {name}
      </h3>

      <p
        className="mt-2"
        style={{
          color: "var(--q-muted)",
        }}
      >
        {role}
      </p>

      <p
        className="mt-4"
        style={{
          color: "var(--q-muted)",
        }}
      >
        {specialization}
      </p>

    </article>

  );

}
