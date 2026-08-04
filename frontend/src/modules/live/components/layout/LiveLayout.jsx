import LiveHeader from "../header/LiveHeader";
import LiveControls from "../controls/LiveControls";
import ViewerList from "../viewer/ViewerList";
import LiveChat from "../chat/LiveChat";

export default function LiveLayout(props){

  return(

<div className="flex h-screen bg-[var(--q-bg)]">

<div className="flex flex-1 flex-col">

<LiveHeader {...props}/>

<div className="flex-1">
{props.children}
</div>

<LiveControls {...props}/>

</div>

<div className="w-96 border-l border-[var(--q-border)] flex flex-col">

<div className="h-72">
<ViewerList viewers={props.viewers}/>
</div>

<div className="flex-1">
<LiveChat
messages={props.messages}
onSend={props.onSend}
/>
</div>

</div>

</div>

);
}
