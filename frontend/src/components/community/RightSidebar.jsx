import SocialHub from "./SocialHub";

const developers = [
  {
    name: "OpenAI",
    role: "AI Research",
  },
  {
    name: "Google",
    role: "Web & AI",
  },
  {
    name: "Microsoft",
    role: "Cloud",
  },
];

const jobs = [
  "Frontend Developer",
  "Backend Developer",
  "Flutter Developer",
];

const aiTools = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Copilot",
];

export default function RightSidebar() {
  return (
    <div
      className="
        h-full
        overflow-y-auto
        bg-[var(--q-bg)]
        p-4
        space-y-5
      "
    >
      <SocialHub />

      <div
        className="
          rounded-2xl
          border
          border-[var(--q-border)]
          bg-[var(--q-surface)]
          p-5
        "
      >
        <h2 className="mb-4 text-lg font-bold text-[var(--q-text)]">
          🔥 Trending Developers
        </h2>

        {developers.map((item) => (
          <div
            key={item.name}
            className="
              mb-3
              rounded-xl
              bg-[var(--q-card)]
              p-3
            "
          >
            <div className="font-semibold text-[var(--q-text)]">
              {item.name}
            </div>

            <div className="text-sm text-[var(--q-muted)]">
              {item.role}
            </div>
          </div>
        ))}
      </div>

      <div
        className="
          rounded-2xl
          border
          border-[var(--q-border)]
          bg-[var(--q-surface)]
          p-5
        "
      >
        <h2 className="mb-4 text-lg font-bold text-[var(--q-text)]">
          💼 Latest Jobs
        </h2>

        {jobs.map((job) => (
          <div
            key={job}
            className="
              mb-2
              rounded-lg
              bg-[var(--q-card)]
              p-3
              text-[var(--q-muted)]
            "
          >
            {job}
          </div>
        ))}
      </div>

      <div
        className="
          rounded-2xl
          border
          border-[var(--q-border)]
          bg-[var(--q-surface)]
          p-5
        "
      >
        <h2 className="mb-4 text-lg font-bold text-[var(--q-text)]">
          🤖 AI Tools
        </h2>

        {aiTools.map((tool) => (
          <div
            key={tool}
            className="
              mb-2
              rounded-lg
              bg-[var(--q-card)]
              p-3
              text-[var(--q-muted)]
            "
          >
            {tool}
          </div>
        ))}
      </div>

      <div
        className="
          rounded-2xl
          border
          border-[var(--q-border)]
          bg-[var(--q-surface)]
          p-5
        "
      >
        <h2 className="mb-4 text-lg font-bold text-[var(--q-text)]">
          📊 Community Statistics
        </h2>

        <div className="space-y-2 text-[var(--q-muted)]">
          <div>Total Posts : 0</div>
          <div>Videos : 0</div>
          <div>Projects : 0</div>
          <div>Members : 0</div>
        </div>
      </div>
    </div>
  );
}
