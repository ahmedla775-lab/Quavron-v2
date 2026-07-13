import { useEffect } from "react";

import ExplorerToolbar from "./ExplorerToolbar";
import SearchBar from "./SearchBar";
import TreeNode from "./TreeNode";

import { useFiles } from "../../../context/FileContext";
import { useTabs } from "../../../context/TabContext";
import { useProject } from "../../../context/ProjectContext";

export default function Explorer() {

  const {
    files,
    openFile,
  } = useFiles();

  const {
    openTab,
  } = useTabs();

  const {
    project,
  } = useProject();

  useEffect(() => {

    if (!project) return;

    // سيتم لاحقاً تحميل ملفات المشروع من Supabase

  }, [project]);

  function handleOpen(file) {

    openFile(file);

    openTab(file);

  }

  function handleNewFile() {

    if (!project) {

      alert("Please open a project first.");

      return;

    }

    alert("New File feature will be connected to Supabase in the next step.");

  }

  function handleNewFolder() {

    if (!project) {

      alert("Please open a project first.");

      return;

    }

    alert("New Folder feature will be added next.");

  }

  function handleRefresh() {

    window.location.reload();

  }

  return (

    <div className="flex h-full flex-col bg-slate-900">

      <ExplorerToolbar
        onNewFile={handleNewFile}
        onNewFolder={handleNewFolder}
        onRefresh={handleRefresh}
      />

      <SearchBar />

      <div className="flex-1 overflow-y-auto p-2">

        {files.map((item) => (

          <TreeNode
            key={item.id}
            item={item}
            onOpen={handleOpen}
          />

        ))}

      </div>

    </div>

  );

}
