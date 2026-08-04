const items = [

  "Learning Feed",

  "Explore",

  "Educators",

  "Domains",

  "Learning Methods",

  "My Learning",

];

export default function LearningSidebar() {

  return (

    <aside
      className="rounded-3xl border p-5"
      style={{
        background: "var(--q-surface)",
        borderColor: "var(--q-border)",
      }}
    >

      <nav className="space-y-3">

        {items.map((item) => (

          <button
            key={item}
            className="block w-full rounded-xl px-4 py-3 text-left transition hover:opacity-80"
          >

            {item}

          </button>

        ))}

      </nav>

    </aside>

  );

}
