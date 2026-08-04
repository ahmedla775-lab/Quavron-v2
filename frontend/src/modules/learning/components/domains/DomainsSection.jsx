import DomainCard from "./DomainCard";

export default function DomainsSection() {

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
        Learning Domains
      </h2>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">

        <DomainCard />

        <DomainCard
          title="Business"
          description="Management, finance, accounting and entrepreneurship."
        />

        <DomainCard
          title="Languages"
          description="English, French, Arabic and communication skills."
        />

      </div>

    </section>

  );

}
