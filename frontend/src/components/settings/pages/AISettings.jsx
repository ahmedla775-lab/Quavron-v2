import React from "react";

const AISettings = () => {
  return (
    <div className="space-y-4 p-3 md:p-6">
      <h2 className="text-xl font-semibold text-[var(--q-text)]">
        AI Settings
      </h2>

      <div className="rounded-xl border border-[var(--q-border)] bg-[var(--q-surface)] p-4">
        <p className="text-[var(--q-muted)]">
          Manage AI assistant preferences, models, and automation settings.
        </p>
      </div>
    </div>
  );
};

export default AISettings;
