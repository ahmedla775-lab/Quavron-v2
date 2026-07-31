import {
  BadgeCheck,
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  Star,
} from "lucide-react";

export default function CompanyProfileCard() {
  return (
    <section
      className="rounded-3xl border p-8"
      style={{
        background: "var(--q-surface)",
        borderColor: "var(--q-border)",
      }}
    >
      <div className="flex flex-col gap-8 lg:flex-row">

        <div className="flex flex-col items-center">

          <div
            className="flex h-32 w-32 items-center justify-center rounded-3xl"
            style={{
              background: "#06b6d4",
              color: "#fff",
            }}
          >
            <Building2 size={60} />
          </div>

          <button
            className="mt-6 rounded-2xl px-6 py-3 font-bold"
            style={{
              background: "#06b6d4",
              color: "#fff",
            }}
          >
            Contact Company
          </button>

        </div>

        <div className="flex-1">

          <div className="flex items-center gap-3">

            <h1
              className="text-4xl font-black"
              style={{ color: "var(--q-text)" }}
            >
              Quavron Logistics
            </h1>

            <BadgeCheck color="#06b6d4" size={28} />

          </div>

          <p
            className="mt-4 text-lg"
            style={{ color: "var(--q-muted)" }}
          >
            Professional delivery and logistics company
            serving businesses across Algeria.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">

            <Info icon={<MapPin size={18} />} label="Djelfa, Algeria" />

            <Info icon={<Phone size={18} />} label="+213 XXX XX XX XX" />

            <Info icon={<Mail size={18} />} label="contact@company.com" />

            <Info icon={<Globe size={18} />} label="www.company.com" />

            <Info icon={<Star size={18} />} label="4.9 / 5 Rating" />

          </div>

        </div>

      </div>
    </section>
  );
}

function Info({ icon, label }) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border p-4"
      style={{
        borderColor: "var(--q-border)",
      }}
    >
      {icon}

      <span>{label}</span>
    </div>
  );
}
