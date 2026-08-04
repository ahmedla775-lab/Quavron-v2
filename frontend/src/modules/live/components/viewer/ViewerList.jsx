export default function ViewerList({
viewers = [],
}) {

return (

<div className="border-b border-[var(--q-border)] bg-[var(--q-card)]">

<div className="px-4 py-3 font-semibold text-[var(--q-text)]">
Viewers ({viewers.length})
</div>

<div className="max-h-72 overflow-y-auto">

{viewers.length === 0 ? (

<div className="px-4 py-8 text-center text-[var(--q-muted)]">
No viewers yet
</div>

) : (

viewers.map((viewer) => (

<div
key={viewer.id}
className="flex items-center gap-3 px-4 py-3"
>

<img
src={viewer.avatar}
alt=""
className="h-9 w-9 rounded-full"
/>

<div>

<div className="font-medium text-[var(--q-text)]">
{viewer.name}
</div>

<div className="text-xs text-[var(--q-muted)]">
@{viewer.username}
</div>

</div>

</div>

))

)}

</div>

</div>

);

}
