import ExplorerItem from "./ExplorerItem";
import ExplorerToolbar from "./ExplorerToolbar";

import useExplorer from "../../modules/workspace/hooks/useExplorer";

export default function ExplorerPanel() {

  const {

    tree,

  } = useExplorer();

  return (

    <div className="h-full overflow-y-auto bg-slate-900">

      <ExplorerToolbar />

      <div className="border-b border-slate-800 p-4">

        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">

          Explorer

        </h2>

      </div>

      <div className="p-2">

        {tree.map((item) => (

          <ExplorerItem

            key={item.id}

            item={item}

          />

        ))}

      </div>

    </div>

  );

}
