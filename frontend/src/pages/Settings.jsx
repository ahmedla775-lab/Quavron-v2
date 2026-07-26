import { useState } from "react";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import SettingsSidebar from "../components/settings/SettingsSidebar";
import SettingsSearch from "../components/settings/SettingsSearch";
import SettingsContent from "../components/settings/SettingsContent";

export default function Settings() {

  const [selected, setSelected] = useState("account");

  const [search, setSearch] = useState("");

  return (

    <DashboardLayout>

      <div
        className="
          flex
          h-[calc(100vh-40px)]
          overflow-hidden
          rounded-2xl
          border
          border-slate-800
          bg-slate-950
        "
      >

        <SettingsSidebar
          selected={selected}
          onSelect={setSelected}
        />

        <div
          className="
            flex
            min-w-0
            flex-1
            flex-col
          "
        >

          <SettingsSearch
            value={search}
            onChange={setSearch}
          />

          <SettingsContent
            selected={selected}
            search={search}
          />

        </div>

      </div>

    </DashboardLayout>

  );

}
