import {
Mic,
MicOff,
Video,
VideoOff,
Monitor,
UserPlus,
Settings,
} from "lucide-react";

export default function LiveControls({
micEnabled,
cameraEnabled,
onToggleMic,
onToggleCamera,
onShareScreen,
onInvite,
onSettings,
}) {
return (

<div className="flex items-center justify-center gap-4 border-t border-[var(--q-border)] bg-[var(--q-card)] p-4">

<button onClick={onToggleMic}>
{micEnabled ? <Mic /> : <MicOff />}
</button>

<button onClick={onToggleCamera}>
{cameraEnabled ? <Video /> : <VideoOff />}
</button>

<button onClick={onShareScreen}>
<Monitor />
</button>

<button onClick={onInvite}>
<UserPlus />
</button>

<button onClick={onSettings}>
<Settings />
</button>

</div>

);
}
