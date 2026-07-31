import {
  User,
  MapPin,
  ShoppingBag,
  DollarSign,
  Star,
  MessageCircle,
  Shield,
} from "lucide-react";

const customers = [
  {
    id: 1,
    name: "Ahmed Mourad",
    country: "Algeria",
    state: "Djelfa",
    city: "Djelfa",
    orders: 42,
    spent: "2,450,000 DZD",
    rating: 5,
    loyalty: "Gold",
  },
  {
    id: 2,
    name: "Sara Ali",
    country: "Algeria",
    state: "Algiers",
    city: "Bab Ezzouar",
    orders: 12,
    spent: "640,000 DZD",
    rating: 4.8,
    loyalty: "Silver",
  },
];

export default function CustomersManager() {

  return (

    <section className="space-y-8">

      <div>

        <h2
          className="text-3xl font-black"
          style={{ color: "var(--q-text)" }}
        >
          Customers CRM
        </h2>

        <p style={{ color: "var(--q-muted)" }}>
          Manage customers, loyalty and purchase history.
        </p>

      </div>

      <div className="grid gap-6">

        {customers.map((customer) => (

          <div
            key={customer.id}
            className="rounded-3xl border p-6"
            style={{
              background: "var(--q-surface)",
              borderColor: "var(--q-border)",
            }}
          >

            <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">

              <div>

                <div className="flex items-center gap-3">

                  <User className="text-cyan-500" />

                  <h3
                    className="text-2xl font-bold"
                    style={{ color: "var(--q-text)" }}
                  >
                    {customer.name}
                  </h3>

                </div>

                <div
                  className="mt-4 flex flex-wrap gap-6"
                  style={{ color: "var(--q-muted)" }}
                >

                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    {customer.country} • {customer.state} • {customer.city}
                  </div>

                  <div className="flex items-center gap-2">
                    <ShoppingBag size={18} />
                    {customer.orders} Orders
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign size={18} />
                    {customer.spent}
                  </div>

                  <div className="flex items-center gap-2">
                    <Star size={18} />
                    {customer.rating}
                  </div>

                </div>

              </div>

              <div className="flex flex-wrap gap-3">

                <button className="rounded-2xl bg-cyan-500 px-5 py-3 text-white font-bold">

                  <MessageCircle size={18} />

                </button>

                <button className="rounded-2xl border px-5 py-3">

                  Orders

                </button>

                <button className="rounded-2xl border px-5 py-3">

                  Wishlist

                </button>

                <button className="rounded-2xl border px-5 py-3">

                  Loyalty {customer.loyalty}

                </button>

                <button className="rounded-2xl border px-5 py-3 text-red-500">

                  <Shield size={18} />

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>

  );

}
