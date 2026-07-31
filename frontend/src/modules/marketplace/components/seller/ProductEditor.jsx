import {
  Save,
  ImagePlus,
  Package,
} from "lucide-react";

export default function ProductEditor() {

  return (

    <section className="space-y-8">

      <div>

        <h2
          className="text-3xl font-black"
          style={{ color: "var(--q-text)" }}
        >
          Product Editor
        </h2>

        <p style={{ color: "var(--q-muted)" }}>
          Create or edit marketplace products.
        </p>

      </div>

      <div
        className="rounded-3xl border p-8 space-y-6"
        style={{
          background: "var(--q-surface)",
          borderColor: "var(--q-border)",
        }}
      >

        <div className="grid gap-6 lg:grid-cols-2">

          <div>

            <label className="mb-2 block font-semibold">
              Product Name
            </label>

            <input
              className="w-full rounded-2xl border p-3"
              placeholder="Industrial Generator"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Category
            </label>

            <select
              className="w-full rounded-2xl border p-3"
            >
              <option>Industrial</option>
              <option>Electronics</option>
              <option>Services</option>
              <option>Food</option>
              <option>Construction</option>
            </select>

          </div>

        </div>

        <div>

          <label className="mb-2 block font-semibold">
            Description
          </label>

          <textarea
            rows={6}
            className="w-full rounded-2xl border p-3"
            placeholder="Describe your product..."
          />

        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          <div>

            <label className="mb-2 block font-semibold">
              Price
            </label>

            <input
              type="number"
              className="w-full rounded-2xl border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Stock
            </label>

            <input
              type="number"
              className="w-full rounded-2xl border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Discount %
            </label>

            <input
              type="number"
              className="w-full rounded-2xl border p-3"
            />

          </div>

        </div>

        <div>

          <label className="mb-4 block font-semibold">
            Product Images
          </label>

          <button
            className="flex items-center gap-3 rounded-2xl border px-6 py-4"
          >

            <ImagePlus size={20}/>

            Upload Images

          </button>

        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          <div>

            <label className="mb-2 block font-semibold">
              Weight
            </label>

            <input
              className="w-full rounded-2xl border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Dimensions
            </label>

            <input
              className="w-full rounded-2xl border p-3"
            />

          </div>

        </div>

        <div className="flex gap-4">

          <button
            className="flex items-center gap-3 rounded-2xl px-6 py-3 font-bold"
            style={{
              background:"#06b6d4",
              color:"#fff",
            }}
          >

            <Save size={20}/>

            Save Product

          </button>

          <button
            className="flex items-center gap-3 rounded-2xl border px-6 py-3"
          >

            <Package size={20}/>

            Preview

          </button>

        </div>

      </div>

    </section>

  );

}
