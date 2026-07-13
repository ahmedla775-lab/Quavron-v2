import BranchSelector from "./BranchSelector";
import CommitBox from "./CommitBox";
import GitChanges from "./GitChanges";
import RemotePanel from "./RemotePanel";

export default function GitPanel() {

  return (

    <div className="flex h-full flex-col bg-slate-950">

      <BranchSelector />

      <CommitBox />

      <GitChanges />

      <RemotePanel />

    </div>

  );

}

