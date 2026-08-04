import EducatorCard from "./EducatorCard";

export default function EducatorsSection() {

  return (

    <section
      className="rounded-3xl border p-6"
      style={{
        background: "var(--q-surface)",
        borderColor: "var(--q-border)",
      }}
    >

      <h2
        className="text-2xl font-bold"
        style={{
          color: "var(--q-text)",
        }}
      >
        Educators
      </h2>

      <div className="mt-6 grid gap-6 md:grid-cols-2">

        <EducatorCard />

        <EducatorCard
          name="Global Business Institute"
          specialization="Business"
        />

      </div>

    </section>

  );

}
