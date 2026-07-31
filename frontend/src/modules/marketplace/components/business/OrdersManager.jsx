import {
  Package,
  Truck,
  CheckCircle,
  Clock3,
  XCircle,
  RotateCcw,
} from "lucide-react";

const orders = [
  {
    id: "#QV-2026001",
    customer: "Ahmed Mourad",
    country: "Algeria",
    state: "Djelfa",
    city: "Djelfa",
    company: "Quavron Express",
    total: "245,000 DZD",
    payment: "Paid",
    status: "Processing",
  },
  {
    id: "#QV-2026002",
    customer: "Sara Ali",
    country: "Algeria",
    state: "Algiers",
    city: "Bab Ezzouar",
    company: "Yalidine",
    total: "18,500 DZD",
    payment: "Pending",
    status: "Shipping",
  },
  {
    id: "#QV-2026003",
    customer: "Mohamed Karim",
    country: "Tunisia",
    state: "Tunis",
    city: "Tunis",
    company: "EMS",
    total: "120,000 DZD",
    payment: "Paid",
    status: "Delivered",
  },
];

const statusIcon = {
  Processing: Clock3,
  Shipping: Truck,
  Delivered: CheckCircle,
  Cancelled: XCircle,
  Returned: RotateCcw,
};

export default function OrdersManager() {

  return (

    <section className="space-y-8">

      <div>

        <h2
          className="text-3xl font-black"
          style={{ color: "var(--q-text)" }}
        >
          Orders Management
        </h2>

        <p style={{ color: "var(--q-muted)" }}>
          Track and manage all customer orders.
        </p>

      </div>

      <div
        className="overflow-hidden rounded-3xl border"
        style={{
          background: "var(--q-surface)",
          borderColor: "var(--q-border)",
        }}
      >

        <table className="w-full">

          <thead>

            <tr
              style={{
                background: "rgba(6,182,212,.08)",
              }}
            >

              <th className="p-4 text-left">Order</th>
              <th>Customer</th>
              <th>Location</th>
              <th>Delivery</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            {orders.map((order) => {

              const Icon = statusIcon[order.status] || Package;

              return (

                <tr
                  key={order.id}
                  className="border-t"
                  style={{
                    borderColor: "var(--q-border)",
                  }}
                >

                  <td className="p-4 font-bold">
                    {order.id}
                  </td>

                  <td>{order.customer}</td>

                  <td>
                    {order.country}
                    <br />
                    <small>
                      {order.state} • {order.city}
                    </small>
                  </td>

                  <td>{order.company}</td>

                  <td>{order.total}</td>

                  <td>{order.payment}</td>

                  <td>

                    <div className="flex items-center gap-2">

                      <Icon
                        size={18}
                        className="text-cyan-500"
                      />

                      {order.status}

                    </div>

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </section>

  );

}
