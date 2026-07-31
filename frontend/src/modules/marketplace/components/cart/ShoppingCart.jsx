import {
  ShoppingCart as ShoppingCartIcon,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

const items = [
  {
    id: 1,
    name: "Quavron AI Workstation",
    seller: "Quavron Official",
    price: 245000,
    quantity: 1,
  },
  {
    id: 2,
    name: "Developer Mechanical Keyboard",
    seller: "Tech Store",
    price: 18500,
    quantity: 2,
  },
];

export default function ShoppingCart() {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <section className="space-y-8">

      <div>
        <h2
          className="text-3xl font-black"
          style={{ color: "var(--q-text)" }}
        >
          Shopping Cart
        </h2>

        <p style={{ color: "var(--q-muted)" }}>
          Review your selected products before checkout.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">

        <div className="space-y-5 lg:col-span-2">

          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border p-6"
              style={{
                background: "var(--q-surface)",
                borderColor: "var(--q-border)",
              }}
            >

              <div className="flex items-start justify-between gap-5">

                <div className="flex gap-5">

                  <div
                    className="h-24 w-24 rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(135deg,#0ea5e9,#0891b2)",
                    }}
                  />

                  <div>

                    <h3
                      className="text-xl font-bold"
                      style={{ color: "var(--q-text)" }}
                    >
                      {item.name}
                    </h3>

                    <p style={{ color: "var(--q-muted)" }}>
                      {item.seller}
                    </p>

                    <p className="mt-3 font-bold text-cyan-500">
                      {item.price.toLocaleString()} DZD
                    </p>

                  </div>

                </div>

                <button className="text-red-500">
                  <Trash2 size={20} />
                </button>

              </div>


              <div className="mt-6 flex items-center gap-3">

                <button className="rounded-xl border p-2">
                  <Minus size={18} />
                </button>

                <span className="font-bold">
                  {item.quantity}
                </span>

                <button className="rounded-xl border p-2">
                  <Plus size={18} />
                </button>

              </div>

            </div>
          ))}

        </div>


        <div
          className="h-fit rounded-3xl border p-6"
          style={{
            background: "var(--q-surface)",
            borderColor: "var(--q-border)",
          }}
        >

          <div className="flex items-center gap-3">

            <ShoppingCartIcon size={22} />

            <h3
              className="text-xl font-bold"
              style={{ color: "var(--q-text)" }}
            >
              Order Summary
            </h3>

          </div>


          <div className="mt-8 space-y-4">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <strong>
                {subtotal.toLocaleString()} DZD
              </strong>
            </div>


            <div className="flex justify-between">
              <span>Shipping</span>
              <strong>
                Calculated later
              </strong>
            </div>


            <div className="flex justify-between">
              <span>Tax</span>
              <strong>
                Depends on country
              </strong>
            </div>


            <hr />


            <div className="flex justify-between text-xl font-black">

              <span>
                Total
              </span>

              <span className="text-cyan-500">
                {subtotal.toLocaleString()} DZD
              </span>

            </div>

          </div>


          <button
            className="mt-8 w-full rounded-2xl bg-cyan-500 py-4 font-bold text-white"
          >
            Continue to Checkout
          </button>

        </div>

      </div>

    </section>
  );
}
