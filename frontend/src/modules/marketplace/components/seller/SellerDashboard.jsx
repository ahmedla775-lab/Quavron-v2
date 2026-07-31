import {
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  Users,
  TrendingUp,
} from "lucide-react";

const cards = [
  {
    title: "Products",
    value: "248",
    icon: Package,
    color: "#06b6d4",
  },
  {
    title: "Orders",
    value: "128",
    icon: ShoppingBag,
    color: "#22c55e",
  },
  {
    title: "Customers",
    value: "624",
    icon: Users,
    color: "#f59e0b",
  },
  {
    title: "Revenue",
    value: "$48,520",
    icon: DollarSign,
    color: "#8b5cf6",
  },
];

export default function SellerDashboard() {

  return (

    <section className="space-y-8">

      <div>

        <h2
          className="text-3xl font-black"
          style={{ color: "var(--q-text)" }}
        >
          Seller Center
        </h2>

        <p style={{ color: "var(--q-muted)" }}>
          Manage your business inside Quavron Marketplace.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {cards.map(card => {

          const Icon = card.icon;

          return (

            <article
              key={card.title}
              className="rounded-3xl border p-6"
              style={{
                background: "var(--q-surface)",
                borderColor: "var(--q-border)",
              }}
            >

              <div className="flex items-center justify-between">

                <div>

                  <p
                    style={{
                      color: "var(--q-muted)",
                    }}
                  >
                    {card.title}
                  </p>

                  <h3
                    className="mt-3 text-4xl font-black"
                    style={{
                      color: "var(--q-text)",
                    }}
                  >
                    {card.value}
                  </h3>

                </div>

                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: card.color,
                    color: "#fff",
                  }}
                >
                  <Icon size={30}/>
                </div>

              </div>

            </article>

          );

        })}

      </div>

      <div
        className="rounded-3xl border p-8"
        style={{
          background: "var(--q-surface)",
          borderColor: "var(--q-border)",
        }}
      >

        <div className="flex items-center gap-4">

          <Store
            size={40}
            color="#06b6d4"
          />

          <div>

            <h3
              className="text-2xl font-bold"
              style={{
                color: "var(--q-text)",
              }}
            >
              Business Overview
            </h3>

            <p
              style={{
                color: "var(--q-muted)",
              }}
            >
              Your business is growing successfully on Quavron Marketplace.
            </p>

          </div>

        </div>

        <div
          className="mt-8 flex items-center gap-3 text-cyan-500 font-bold"
        >

          <TrendingUp size={22}/>

          Sales increased by 24% this month

        </div>

      </div>

    </section>

  );

}
