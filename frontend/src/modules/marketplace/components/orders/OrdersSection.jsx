import {
  Package,
  Clock3,
  CheckCircle2,
  Truck,
  Eye,
} from "lucide-react";

const orders = [
  {
    id: "#QV-10021",
    customer: "Ahmed Mourad",
    company: "North Industrial",
    total: "$4,818",
    status: "Processing",
    icon: Clock3,
    color: "#f59e0b",
  },
  {
    id: "#QV-10020",
    customer: "Ahmed Mourad",
    company: "Quavron Logistics",
    total: "$1,240",
    status: "Shipping",
    icon: Truck,
    color: "#06b6d4",
  },
  {
    id: "#QV-10019",
    customer: "Ahmed Mourad",
    company: "Smart Electronics",
    total: "$840",
    status: "Delivered",
    icon: CheckCircle2,
    color: "#22c55e",
  },
];

export default function OrdersSection() {

  return (

    <section className="space-y-6">

      <div>

        <h2
          className="text-3xl font-black"
          style={{ color: "var(--q-text)" }}
        >
          My Orders
        </h2>

        <p style={{ color: "var(--q-muted)" }}>
          Track all your marketplace orders.
        </p>

      </div>

      {orders.map(order => {

        const Icon = order.icon;

        return (

          <article
            key={order.id}
            className="rounded-3xl border p-6"
            style={{
              background: "var(--q-surface)",
              borderColor: "var(--q-border)",
            }}
          >

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-center gap-5">

                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: order.color,
                    color: "#fff",
                  }}
                >
                  <Package size={30}/>
                </div>

                <div>

                  <h3
                    className="text-xl font-bold"
                    style={{
                      color: "var(--q-text)",
                    }}
                  >
                    {order.id}
                  </h3>

                  <p style={{ color: "var(--q-muted)" }}>
                    {order.company}
                  </p>

                  <p
                    className="mt-2"
                    style={{
                      color: order.color,
                      fontWeight: 700,
                    }}
                  >
                    <Icon size={16}/>
                    {" "}
                    {order.status}
                  </p>

                </div>

              </div>

              <div className="text-center">

                <div
                  className="text-3xl font-black"
                  style={{
                    color: "#06b6d4",
                  }}
                >
                  {order.total}
                </div>

                <button
                  className="mt-4 flex items-center gap-2 rounded-2xl px-5 py-3 font-bold"
                  style={{
                    background: "#06b6d4",
                    color: "#fff",
                  }}
                >
                  <Eye size={18}/>
                  View Details
                </button>

              </div>

            </div>

          </article>

        );

      })}

    </section>

  );

}
