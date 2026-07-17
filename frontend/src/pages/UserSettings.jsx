import { useState } from "react";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import SecuritySettings from "../components/settings/SecuritySettings";
import SessionsSettings from "../components/settings/SessionsSettings";
import TwoFactorSettings from "../components/settings/TwoFactorSettings";
import SecurityActivity from "../components/settings/SecurityActivity";

import PrivacySettings from "../components/settings/PrivacySettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import LanguageSettings from "../components/settings/LanguageSettings";
import ConnectedAccountsSettings from "../components/settings/ConnectedAccountsSettings";

import DeveloperSettings from "../components/settings/DeveloperSettings";
import DangerZoneSettings from "../components/settings/DangerZoneSettings";

const sections = [
  "Account",
  "Security",
  "Privacy",
  "Notifications",
  "Appearance",
  "Language",
  "Connected Accounts",
  "Developer",
  "Danger Zone",
];

export default function UserSettings() {

  const [active, setActive] =
    useState("Account");

  return (

    <DashboardLayout>

      <div className="mx-auto flex max-w-7xl gap-8">

        <aside className="w-72">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">

            {sections.map((item) => (

              <button
                key={item}
                onClick={() => setActive(item)}
                className={`mb-2 w-full rounded-xl px-4 py-3 text-left transition ${
                  active === item
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >

                {item}

              </button>

            ))}

          </div>

        </aside>

        <main className="flex-1">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

            <h1 className="mb-8 text-3xl font-bold text-white">

              {active}

            </h1>

            {active === "Account" && (

              <div className="rounded-xl border border-dashed border-slate-700 p-12 text-center text-slate-400">

                Account settings will be available soon.

              </div>

            )}

            {active === "Security" && (

              <div className="space-y-10">

                <SecuritySettings />

                <SessionsSettings />

                <TwoFactorSettings />

                <SecurityActivity />

              </div>

            )}

            {active === "Privacy" && (

              <PrivacySettings />

            )}

            {active === "Notifications" && (

              <NotificationSettings />

            )}

            {active === "Appearance" && (

              <AppearanceSettings />

            )}

            {active === "Language" && (

              <LanguageSettings />

            )}

            {active === "Connected Accounts" && (

              <ConnectedAccountsSettings />

            )}

            {active === "Developer" && (

              <DeveloperSettings />

            )}

            {active === "Danger Zone" && (

              <DangerZoneSettings />

            )}

          </div>

        </main>

      </div>

    </DashboardLayout>

  );

}
