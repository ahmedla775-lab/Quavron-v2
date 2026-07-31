import {
  ShoppingCart,
  Star,
  Package,
  Truck,
} from "lucide-react";

const products = [
  {
    id: 1,
    name: "Industrial Generator",
    company: "North Industrial",
    category: "Industrial",
    price: "$2,450",
    rating: 4.9,
    delivery: "Available",
  },
  {
    id: 2,
    name: "Gaming Laptop",
    company: "Smart Electronics",
    category: "Technology",
    price: "$1,180",
    rating: 4.8,
    delivery: "24 Hours",
  },
  {
    id: 3,
    name: "Construction Tools",
    company: "BuildTech",
    category: "Construction",
    price: "$520",
    rating: 4.7,
    delivery: "Available",
  },
];

export default function ProductGrid() {
  return (
    <section className="space-y-6">

      <div>

        <h2
          className="text-3xl font-black"
          style={{ color: "var(--q-text)" }}
        >
          Featured Products
        </h2>

        <p
          style={{ color: "var(--q-muted)" }}
        >
          Products from verified companies.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {products.map(product => (

          <article
            key={product.id}
            className="rounded-3xl border overflow-hidden transition hover:-translate-y-1"
            style={{
              background: "var(--q-surface)",
              borderColor: "var(--q-border)",
            }}
          >

            <div
              className="h-52 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg,#06b6d4,#0f172a)",
              }}
            >
              <Package
                size={70}
                color="#fff"
              />
            </div>

            <div className="p-6">

              <h3
                className="text-xl font-bold"
                style={{
                  color: "var(--q-text)",
                }}
              >
                {product.name}
              </h3>

              <p
                className="mt-2"
                style={{
                  color: "var(--q-muted)",
                }}
              >
                {product.company}
              </p>

              <div className="mt-5 flex items-center justify-between">

                <span
                  className="rounded-full px-3 py-1 text-sm"
                  style={{
                    background: "#06b6d4",
                    color: "#fff",
                  }}
                >
                  {product.category}
                </span>

                <strong>{product.price}</strong>

              </div>

              <div className="mt-5 flex items-center justify-between">

                <span className="flex items-center gap-2">
                  <Star
                    size={18}
                    color="#facc15"
                  />
                  {product.rating}
                </span>

                <span className="flex items-center gap-2">
                  <Truck size={18}/>
                  {product.delivery}
                </span>

              </div>

              <button
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-bold"
                style={{
                  background: "#06b6d4",
                  color: "#fff",
                }}
              >
                <ShoppingCart size={20}/>
                Add to Cart
              </button>

            </div>

          </article>

        ))}

      </div>

    </section>
  );
}
