import {
  Building2,
  BadgeCheck,
  MapPin,
  Package,
} from "lucide-react";

import { useTheme } from "../../../../theme/ThemeProvider";

const companies = [
  {
    id: 1,
    name: "Quavron Logistics",
    category: "Delivery Company",
    city: "Djelfa",
    products: 284,
    verified: true,
  },
  {
    id: 2,
    name: "North Industrial",
    category: "Industrial Company",
    city: "Algiers",
    products: 812,
    verified: true,
  },
  {
    id: 3,
    name: "Smart Electronics",
    category: "Technology",
    city: "Oran",
    products: 135,
    verified: false,
  },
];

export default function CompaniesGrid() {

  const { isDark } = useTheme();

  return (

    <section>

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2
            className="text-3xl font-black"
            style={{ color: "var(--q-text)" }}
          >
            Companies
          </h2>

          <p
            style={{ color: "var(--q-muted)" }}
          >
            Verified companies inside Quavron Marketplace.
          </p>

        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {companies.map((company) => (

          <div
            key={company.id}
            className="rounded-3xl border p-6 transition hover:-translate-y-1"
            style={{
              background: "var(--q-surface)",
              borderColor: "var(--q-border)",
            }}
          >

            <div className="flex items-center justify-between">

              <div
                className="rounded-2xl p-4"
                style={{
                  background: "#06b6d4",
                  color: "#fff",
                }}
              >
                <Building2 size={28} />
              </div>

              {company.verified && (

                <BadgeCheck
                  color="#06b6d4"
                  size={24}
                />

              )}

            </div>

            <h3
              className="mt-5 text-xl font-bold"
              style={{ color: "var(--q-text)" }}
            >
              {company.name}
            </h3>

            <p
              className="mt-2"
              style={{ color: "var(--q-muted)" }}
            >
              {company.category}
            </p>

            <div className="mt-6 space-y-3">

              <div className="flex items-center gap-2">

                <MapPin size={18} />

                <span>{company.city}</span>

              </div>

              <div className="flex items-center gap-2">

                <Package size={18} />

                <span>{company.products} Products</span>

              </div>

            </div>

            <button
              className="mt-6 w-full rounded-2xl py-3 font-bold"
              style={{
                background: "#06b6d4",
                color: "#fff",
              }}
            >
              View Company
            </button>

          </div>

        ))}

      </div>

    </section>

  );

}
