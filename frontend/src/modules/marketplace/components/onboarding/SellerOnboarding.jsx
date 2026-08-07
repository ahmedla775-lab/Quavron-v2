import { useState } from "react";

const sellerTypes = [
  {
    id: "individual_seller",
    title: "Individual Seller",
    description: "Sell products or services as an individual.",
  },
  {
    id: "company_seller",
    title: "Company Seller",
    description: "Business or registered company account.",
  },
  {
    id: "industrial_supplier",
    title: "Industrial Supplier",
    description: "Factories, suppliers and industrial partners.",
  },
  {
    id: "service_provider",
    title: "Service Provider",
    description: "Freelancers and professional services.",
  },
];


export default function SellerOnboarding({
  onComplete,
}) {

  const [type, setType] = useState(null);


  return (

    <section className="space-y-8">

      <div>
        <h1 className="text-3xl font-black text-[var(--q-text)]">
          Become a Seller
        </h1>

        <p className="text-[var(--q-muted)]">
          Choose your seller profile type.
        </p>
      </div>


      <div className="grid gap-5 md:grid-cols-2">

        {sellerTypes.map((seller)=>(

          <button
            key={seller.id}
            onClick={() => setType(seller.id)}
            className={`rounded-3xl border p-6 text-left ${
              type === seller.id
              ? "bg-cyan-500 text-white"
              : "bg-[var(--q-surface)]"
            }`}
          >

            <h2 className="text-xl font-bold">
              {seller.title}
            </h2>

            <p className="mt-2">
              {seller.description}
            </p>

          </button>

        ))}

      </div>


      <button
        disabled={!type}
        onClick={() => onComplete(type)}
        className="rounded-xl bg-cyan-500 px-8 py-3 font-bold text-white disabled:opacity-50"
      >
        Continue
      </button>


    </section>

  );

}
