import {
  CreditCard,
  Wallet,
  Landmark,
  Receipt,
  Banknote,
  Bitcoin,
} from "lucide-react";

const methods = [
  {
    title: "Bank Cards",
    icon: CreditCard,
    description: "Visa • Mastercard • Local Cards",
    color: "#2563eb",
  },
  {
    title: "Digital Wallet",
    icon: Wallet,
    description: "Apple Pay • Google Pay • Wallet",
    color: "#06b6d4",
  },
  {
    title: "Bank Transfer",
    icon: Landmark,
    description: "Direct Bank Transfer",
    color: "#10b981",
  },
  {
    title: "Cash On Delivery",
    icon: Banknote,
    description: "Pay after delivery",
    color: "#f59e0b",
  },
  {
    title: "Invoices",
    icon: Receipt,
    description: "Electronic invoices",
    color: "#8b5cf6",
  },
  {
    title: "Crypto (Future)",
    icon: Bitcoin,
    description: "Coming Soon",
    color: "#ef4444",
  },
];

export default function PaymentCenter() {
  return (
    <section className="space-y-8">

      <div>
        <h2
          className="text-3xl font-black"
          style={{ color: "var(--q-text)" }}
        >
          Payment Center
        </h2>

        <p style={{ color: "var(--q-muted)" }}>
          Secure payment management for the entire platform.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {methods.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.title}
              className="rounded-3xl border p-6"
              style={{
                background: "var(--q-surface)",
                borderColor: "var(--q-border)",
              }}
            >

              <div
                className="mb-5 inline-flex rounded-2xl p-4"
                style={{
                  background: item.color,
                  color: "#fff",
                }}
              >

                <Icon size={28} />

              </div>

              <h3
                className="text-xl font-bold"
                style={{ color: "var(--q-text)" }}
              >
                {item.title}
              </h3>

              <p
                className="mt-3"
                style={{ color: "var(--q-muted)" }}
              >
                {item.description}
              </p>

            </div>

          );

        })}

      </div>

    </section>
  );
}
