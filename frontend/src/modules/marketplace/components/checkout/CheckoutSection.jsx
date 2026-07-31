import {
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  Truck,
  ShieldCheck,
} from "lucide-react";

export default function CheckoutSection() {

  return (

    <section className="space-y-6">

      <div>

        <h2
          className="text-3xl font-black"
          style={{ color: "var(--q-text)" }}
        >
          Checkout
        </h2>

        <p
          style={{ color: "var(--q-muted)" }}
        >
          Complete your order information.
        </p>

      </div>

      <div className="grid gap-8 lg:grid-cols-2">

        <div
          className="rounded-3xl border p-6 space-y-5"
          style={{
            background: "var(--q-surface)",
            borderColor: "var(--q-border)",
          }}
        >

          <Input icon={<User size={18}/>} placeholder="Full Name"/>

          <Input icon={<Mail size={18}/>} placeholder="Email"/>

          <Input icon={<Phone size={18}/>} placeholder="Phone Number"/>

          <Input icon={<MapPin size={18}/>} placeholder="Delivery Address"/>

          <textarea
            rows={5}
            placeholder="Additional notes..."
            className="w-full rounded-2xl border p-4 outline-none"
            style={{
              borderColor: "var(--q-border)",
              background: "transparent",
            }}
          />

        </div>

        <div
          className="rounded-3xl border p-6"
          style={{
            background: "var(--q-surface)",
            borderColor: "var(--q-border)",
          }}
        >

          <h3
            className="text-2xl font-bold"
            style={{
              color: "var(--q-text)",
            }}
          >
            Order Summary
          </h3>

          <Summary title="Products" value="$4,810"/>

          <Summary title="Shipping" value="$8"/>

          <Summary title="Tax" value="$0"/>

          <hr className="my-5"/>

          <Summary
            title="Total"
            value="$4,818"
            big
          />

          <div className="mt-8 space-y-4">

            <Payment name="Credit Card"/>

            <Payment name="BaridiMob"/>

            <Payment name="CCP"/>

            <Payment name="Cash On Delivery"/>

          </div>

          <button
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-bold"
            style={{
              background: "#06b6d4",
              color: "#fff",
            }}
          >

            <CreditCard size={20}/>

            Confirm Order

          </button>

        </div>

      </div>

    </section>

  );

}

function Input({ icon, placeholder }) {

  return (

    <div
      className="flex items-center gap-3 rounded-2xl border px-4 py-3"
      style={{
        borderColor: "var(--q-border)",
      }}
    >

      {icon}

      <input
        placeholder={placeholder}
        className="w-full bg-transparent outline-none"
      />

    </div>

  );

}

function Summary({ title, value, big }) {

  return (

    <div className="mt-4 flex justify-between">

      <span
        className={big ? "text-xl font-bold" : ""}
      >
        {title}
      </span>

      <strong
        className={big ? "text-3xl" : ""}
        style={{
          color: big ? "#06b6d4" : "inherit",
        }}
      >
        {value}
      </strong>

    </div>

  );

}

function Payment({ name }) {

  return (

    <label
      className="flex cursor-pointer items-center gap-3 rounded-2xl border p-4"
      style={{
        borderColor: "var(--q-border)",
      }}
    >

      <input type="radio" name="payment"/>

      <Truck size={18}/>

      <span className="flex-1">
        {name}
      </span>

      <ShieldCheck
        size={18}
        color="#06b6d4"
      />

    </label>

  );

}
