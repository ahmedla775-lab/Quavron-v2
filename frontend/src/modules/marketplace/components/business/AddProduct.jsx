import { Save, ImagePlus } from "lucide-react";

export default function AddProduct() {

  return (

    <section className="space-y-8">

      <div>

        <h2
          className="text-3xl font-black"
          style={{ color: "var(--q-text)" }}
        >
          Add New Product
        </h2>

        <p style={{ color: "var(--q-muted)" }}>
          Create a new marketplace product.
        </p>

      </div>

      <div
        className="rounded-3xl border p-8"
        style={{
          background: "var(--q-surface)",
          borderColor: "var(--q-border)",
        }}
      >

        <div className="grid gap-6 md:grid-cols-2">

          <input
            placeholder="Product Name"
            className="rounded-2xl border p-4 bg-transparent"
          />

          <input
            placeholder="SKU"
            className="rounded-2xl border p-4 bg-transparent"
          />

          <select className="rounded-2xl border p-4 bg-transparent">

            <option>Category</option>

            <option>Computers</option>
            <option>Phones</option>
            <option>Accessories</option>
            <option>Cloud</option>
            <option>AI</option>
            <option>Software</option>

          </select>

          <select className="rounded-2xl border p-4 bg-transparent">

            <option>Condition</option>

            <option>New</option>
            <option>Used</option>
            <option>Refurbished</option>

          </select>

          <input
            placeholder="Price"
            className="rounded-2xl border p-4 bg-transparent"
          />

          <input
            placeholder="Stock Quantity"
            className="rounded-2xl border p-4 bg-transparent"
          />

        </div>

        <textarea
          rows={6}
          placeholder="Product Description"
          className="mt-6 w-full rounded-2xl border p-4 bg-transparent"
        />

        <div
          className="mt-6 rounded-3xl border-2 border-dashed p-10 text-center"
          style={{
            borderColor: "var(--q-border)",
          }}
        >

          <ImagePlus
            size={48}
            className="mx-auto text-cyan-500"
          />

          <p
            className="mt-4"
            style={{ color: "var(--q-muted)" }}
          >
            Drag & Drop Product Images
          </p>

          <input
            type="file"
            multiple
            className="mt-5"
          />

        </div>

        <button
          className="mt-8 flex items-center gap-3 rounded-2xl bg-cyan-500 px-8 py-4 font-bold text-white"
        >

          <Save size={20} />

          Save Product

        </button>

      </div>

    </section>

  );

}
