import React from "react";

const DeveloperSettings = () => {
  return (
    <div className="space-y-4 p-3 md:p-6">
      <h2 className="text-xl font-semibold text-[var(--q-text)]">
        Developer Settings
      </h2>

      <div className="rounded-xl border border-[var(--q-border)] bg-[var(--q-surface)] p-4">
        <p className="text-[var(--q-muted)]">
          Manage developer tools, API preferences, and advanced options.
        </p>
      </div>
    </div>
  );
};

export default DeveloperSettings;
