import { useLearning } from "../../context/LearningContext";

const tabs = [
  { id: "feed", label: "Feed" },
  { id: "explore", label: "Explore" },
  { id: "educators", label: "Educators" },
  { id: "domains", label: "Domains" },
  { id: "methods", label: "Methods" },
  { id: "my-learning", label: "My Learning" },
  { id: "certificates", label: "Certificates" },
  { id: "saved", label: "Saved" },
];

export default function LearningTabs() {
  const { page, setPage } = useLearning();

  return (
    <div
      className="flex gap-3 overflow-x-auto rounded-2xl border p-3"
      style={{
        background: "var(--q-surface)",
        borderColor: "var(--q-border)",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setPage(tab.id)}
          className="rounded-xl px-4 py-2 whitespace-nowrap transition"
          style={{
            background:
              page === tab.id
                ? "var(--q-primary)"
                : "var(--q-background)",
            color:
              page === tab.id
                ? "#fff"
                : "var(--q-text)",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
