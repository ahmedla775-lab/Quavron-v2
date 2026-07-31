export default function Card({
children,
className="",
hover=true,
}){

return(

<div
className={`
rounded-2xl
border
shadow-sm
transition-all
duration-300

${hover?"hover:-translate-y-1 hover:shadow-xl":""}

${className}
`}
style={{
background:"var(--q-card)",
borderColor:"var(--q-border)",
color:"var(--q-text)",
}}
>

{children}

</div>

);

}
