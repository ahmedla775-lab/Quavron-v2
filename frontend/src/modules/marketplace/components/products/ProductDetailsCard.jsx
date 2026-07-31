import {
  Building2,
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  Star,
} from "lucide-react";

export default function ProductDetailsCard() {
  return (
    <section
      className="rounded-3xl border p-8"
      style={{
        background: "var(--q-surface)",
        borderColor: "var(--q-border)",
      }}
    >
      <div className="grid gap-8 lg:grid-cols-2">

        <div
          className="flex h-[420px] items-center justify-center rounded-3xl"
          style={{
            background:
              "linear-gradient(135deg,#0ea5e9,#0f172a)",
          }}
        >
          <Building2
            size={120}
            color="#ffffff"
          />
        </div>

        <div>

          <span
            className="rounded-full px-4 py-2 text-sm font-bold"
            style={{
              background: "#06b6d4",
              color: "#fff",
            }}
          >
            VERIFIED PRODUCT
          </span>

          <h1
            className="mt-5 text-4xl font-black"
            style={{
              color: "var(--q-text)",
            }}
          >
            Industrial Generator X900
          </h1>

          <div className="mt-4 flex flex-wrap gap-5">

            <span className="flex items-center gap-2">
              <Star color="#facc15" size={18}/>
              4.9
            </span>

            <span className="flex items-center gap-2">
              <ShieldCheck color="#06b6d4" size={18}/>
              Verified Seller
            </span>

            <span className="flex items-center gap-2">
              <Truck size={18}/>
              Delivery Available
            </span>

          </div>

          <p
            className="mt-6 leading-8"
            style={{
              color: "var(--q-muted)",
            }}
          >
            High-performance industrial generator designed
            for factories, construction sites and heavy-duty
            operations with professional warranty.
          </p>

          <h2
            className="mt-8 text-5xl font-black"
            style={{
              color: "#06b6d4",
            }}
          >
            $2,450
          </h2>

          <div className="mt-8 flex flex-wrap gap-4">

            <button
              className="flex items-center gap-3 rounded-2xl px-7 py-4 font-bold"
              style={{
                background: "#06b6d4",
                color: "#fff",
              }}
            >
              <ShoppingCart size={20}/>
              Buy Now
            </button>

            <button
              className="flex items-center gap-3 rounded-2xl border px-7 py-4"
              style={{
                borderColor: "var(--q-border)",
              }}
            >
              <Heart size={20}/>
              Wishlist
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}
