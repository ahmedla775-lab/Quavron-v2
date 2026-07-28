import LiveHeader from "../header/LiveHeader";
import LiveChat from "../chat/LiveChat";
import ViewerList from "../viewer/ViewerList";
import LiveControls from "../controls/LiveControls";

export default function LiveLayout() {

  return (

    <div className="flex h-screen bg-black text-white">

      <div className="flex flex-1 flex-col">

        <LiveHeader />

        <div className="flex-1 flex items-center justify-center">

          <div className="text-slate-500">
            Camera Preview
          </div>

        </div>

        <LiveControls />

      </div>

      <div className="w-96 border-l border-slate-800 bg-slate-950">

        <ViewerList />

        <LiveChat />

      </div>

    </div>

  );

}
