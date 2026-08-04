import React from "react";

const IDESettings = () => {
  return (
    <div className="space-y-4 p-3 md:p-6">
      <h2 className="text-xl font-semibold text-[var(--q-text)]">
        IDE Settings
      </h2>

      <div className="rounded-xl border border-[var(--q-border)] bg-[var(--q-surface)] p-4">
        <p className="text-[var(--q-muted)]">
          Configure Cloud IDE preferences, editor options, and workspace settings.
        </p>
      </div>
    </div>
  );
};

export default IDESettings;
