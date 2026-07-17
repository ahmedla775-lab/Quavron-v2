import ExplorerItem from "./ExplorerItem";
import ExplorerToolbar from "./ExplorerToolbar";
import {
  useWorkspace,
} from "../../context/WorkspaceContext";

export default function ExplorerPanel() {

  const {

    fileTree,

  } = useWorkspace();

  return (

    <div className="h-full overflow-y-auto bg-slate-900">

      <div className="border-b border-slate-800 p-4">

        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">

          Explorer

        </h2>

      </div>
<ExplorerToolbar />
      <div className="p-2">

        {fileTree.map((item) => (

          <ExplorerItem
            key={item.name}
            item={item}
          />

        ))}

      </div>

    </div>

  );

}
