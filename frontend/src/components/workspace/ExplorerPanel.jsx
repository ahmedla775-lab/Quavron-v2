import ExplorerItem from "./ExplorerItem";
import { useTheme } from "../../theme/ThemeProvider";
import ExplorerToolbar from "./ExplorerToolbar";

import useExplorer from "../../modules/workspace/hooks/useExplorer";

export default function ExplorerPanel({
  onClose,
}) {

  const { tree } = useExplorer();
  const { isDark } = useTheme();

  return (
    <div className="flex h-full flex-col bg-[#1e1e1e]">

      <ExplorerToolbar />

      <div className="border-b border-slate-200 dark:border-slate-800 px-4 py-2">

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-500">
          Explorer
        </p>

      </div>

      <div className="flex-1 overflow-y-auto py-2">

        {tree.length === 0 ? (

          <div className="px-4 py-8 text-center text-sm text-slate-600 dark:text-slate-500">
            Empty Workspace
          </div>

        ) : (

          tree.map((item) => (
            <ExplorerItem
              key={item.id}
              item={item}
              onClose={onClose}
            />
          ))

        )}

      </div>

    </div>
  );

}
