import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Image,
} from "lucide-react";

const products = [
  {
    id: 1,
    name: "Industrial Generator X900",
    category: "Industrial Equipment",
    stock: 14,
    price: "$2450",
  },
  {
    id: 2,
    name: "Gaming Laptop",
    category: "Electronics",
    stock: 32,
    price: "$1180",
  },
  {
    id: 3,
    name: "Office Chair",
    category: "Furniture",
    stock: 80,
    price: "$220",
  },
];

export default function ProductManagement() {

  return (

    <section className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h2
            className="text-3xl font-black"
            style={{ color: "var(--q-text)" }}
          >
            Product Management
          </h2>

          <p style={{ color: "var(--q-muted)" }}>
            Manage all marketplace products.
          </p>

        </div>

        <button
          className="flex items-center gap-3 rounded-2xl px-5 py-3 font-bold"
          style={{
            background: "#06b6d4",
            color: "#fff",
          }}
        >
          <Plus size={20}/>
          Add Product
        </button>

      </div>

      <div className="space-y-5">

        {products.map(product => (

          <article
            key={product.id}
            className="rounded-3xl border p-6"
            style={{
              background: "var(--q-surface)",
              borderColor: "var(--q-border)",
            }}
          >

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-center gap-5">

                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: "#06b6d4",
                    color: "#fff",
                  }}
                >
                  <Package size={28}/>
                </div>

                <div>

                  <h3
                    className="text-xl font-bold"
                    style={{
                      color: "var(--q-text)",
                    }}
                  >
                    {product.name}
                  </h3>

                  <p style={{ color: "var(--q-muted)" }}>
                    {product.category}
                  </p>

                  <div className="mt-2 flex gap-6">

                    <span>
                      Stock: <strong>{product.stock}</strong>
                    </span>

                    <span>
                      Price: <strong>{product.price}</strong>
                    </span>

                  </div>

                </div>

              </div>

              <div className="flex gap-3">

                <button className="rounded-xl border p-3">
                  <Image size={18}/>
                </button>

                <button className="rounded-xl border p-3">
                  <Pencil size={18}/>
                </button>

                <button className="rounded-xl border p-3 text-red-500">
                  <Trash2 size={18}/>
                </button>

              </div>

            </div>

          </article>

        ))}

      </div>

    </section>

  );

}
