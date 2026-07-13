import ExplorerToolbar from "./ExplorerToolbar";
import SearchBar from "./SearchBar";
import TreeNode from "./TreeNode";

import { useFiles } from "../../context/FileContext";
import { useTabs } from "../../context/TabContext";

export default function Explorer() {

  const {
    files,
    openFile,
  } = useFiles();

  const {
    openTab,
  } = useTabs();

  function handleOpen(file) {

    openFile(file);

    openTab(file);

  }

  return (

    <div className="flex h-full flex-col bg-slate-900">

      <ExplorerToolbar />

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

