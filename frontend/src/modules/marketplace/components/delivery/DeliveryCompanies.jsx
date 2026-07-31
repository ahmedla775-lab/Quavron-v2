import {
  Truck,
  Clock3,
  ShieldCheck,
  Star,
} from "lucide-react";

const companies = [
  {
    id: 1,
    name: "Quavron Logistics",
    price: "$8",
    time: "24 Hours",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Fast Express",
    price: "$6",
    time: "48 Hours",
    rating: 4.7,
  },
  {
    id: 3,
    name: "DZ Delivery",
    price: "$5",
    time: "72 Hours",
    rating: 4.6,
  },
];

export default function DeliveryCompanies() {

  return (

    <section className="space-y-6">

      <div>

        <h2
          className="text-3xl font-black"
          style={{
            color: "var(--q-text)",
          }}
        >
          Choose Delivery Company
        </h2>

        <p
          style={{
            color: "var(--q-muted)",
          }}
        >
          Select your preferred shipping company.
        </p>

      </div>

      <div className="space-y-5">

        {companies.map(company => (

          <div
            key={company.id}
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
                    background: "#06b6d4",
                    color: "#fff",
                  }}
                >
                  <Truck size={30}/>
                </div>

                <div>

                  <h3
                    className="text-xl font-bold"
                    style={{
                      color: "var(--q-text)",
                    }}
                  >
                    {company.name}
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-5">

                    <span className="flex items-center gap-2">

                      <Clock3 size={18}/>

                      {company.time}

                    </span>

                    <span className="flex items-center gap-2">

                      <Star
                        size={18}
                        color="#facc15"
                      />

                      {company.rating}

                    </span>

                    <span className="flex items-center gap-2">

                      <ShieldCheck
                        size={18}
                        color="#06b6d4"
                      />

                      Insured

                    </span>

                  </div>

                </div>

              </div>

              <div className="text-center">

                <div
                  className="text-4xl font-black"
                  style={{
                    color: "#06b6d4",
                  }}
                >
                  {company.price}
                </div>

                <button
                  className="mt-4 rounded-2xl px-6 py-3 font-bold"
                  style={{
                    background: "#06b6d4",
                    color: "#fff",
                  }}
                >
                  Select
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>

  );

}
