import {
  LayoutDashboard,
  Code2,
  Bot,
  BookOpen,
  ShoppingCart,
  Cloud,
  Users,
  BarChart3,
  Settings,
  User,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "../auth/AuthProvider";
import useResponsive from "../../hooks/useResponsive";


const menu = [
  {
    key: "dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    key: "cloudIDE",
    icon: Code2,
    path: "/ide",
  },
  {
    key: "aiAssistant",
    icon: Bot,
    path: "/ai",
  },
  {
    key: "courses",
    icon: BookOpen,
    path: "/courses",
  },
  {
    key: "marketplace",
    icon: ShoppingCart,
    path: "/marketplace",
  },
  {
    key: "hosting",
    icon: Cloud,
    path: "/hosting",
  },
  {
    key: "community",
    icon: Users,
    path: "/community",
  },
  {
    key: "analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    key: "profile",
    icon: User,
    path: "/profile",
  },
  {
    key: "settings",
    icon: Settings,
    path: "/settings",
  },
];


export default function Sidebar() {

  const { t } = useTranslation();

  const { profile } = useAuth();

  const { isDesktop } = useResponsive();

  const [open, setOpen] = useState(false);


  const navigation = [...menu];


  if (
    profile?.role === "owner" ||
    profile?.role === "admin"
  ) {

    navigation.push({
      key: "admin",
      icon: ShieldCheck,
      path: "/admin",
    });

  }


  const colors = {

    background: "var(--q-bg)",
    surface: "var(--q-surface)",
    border: "var(--q-border)",
    text: "var(--q-text)",
    muted: "var(--q-muted)",
    active: "var(--q-primary)",

  };


  return (

<>

{!isDesktop && (

<button

onClick={() => setOpen(true)}

className="
fixed
left-3
top-3
z-[70]
flex
h-11
w-11
items-center
justify-center
rounded-xl
shadow-xl
"

style={{
background: colors.surface,
border:`1px solid ${colors.border}`,
color:colors.text
}}

>

<Menu size={20}/>

</button>

)}



{!isDesktop && open && (

<div

onClick={()=>setOpen(false)}

className="
fixed
inset-0
z-[60]
bg-black/40
backdrop-blur-sm
"

/>

)}




<aside

className={`
fixed
left-0
top-0
z-[60]
flex
h-screen
w-72
flex-col
transition-transform
duration-300

${
isDesktop
?
"translate-x-0"
:
open
?
"translate-x-0"
:
"-translate-x-full"
}

`}

style={{

background:colors.background,

borderRight:`1px solid ${colors.border}`,

color:colors.text

}}

>


<div

className="
flex
items-center
justify-between
px-5
py-5
"

style={{

borderBottom:`1px solid ${colors.border}`

}}

>


<div className="flex items-center gap-3">


<img
  src="/branding/quavron-logo.png"
  alt="Quavron"
  className="h-10 w-auto object-contain"
/>

<div>


<h1

className="
text-lg
font-bold
tracking-[2px]
"

style={{

fontFamily:"Orbitron",

color:"var(--q-text)"

}}

>

QUAVRON

</h1>


<p

className="text-xs"

style={{

color:colors.muted

}}

>

Next Generation Platform

</p>


</div>


</div>




{!isDesktop && (

<button

onClick={()=>setOpen(false)}

className="
rounded-lg
p-2
transition
"

style={{

color:colors.text

}}

>

<X size={20}/>

</button>

)}


</div>





<nav

className="
flex-1
overflow-y-auto
p-3
space-y-2
"

>


{

navigation.map((item)=>{


const Icon=item.icon;


return (

<NavLink

key={item.path}

to={item.path}

onClick={()=>!isDesktop && setOpen(false)}

className="
flex
items-center
gap-4
rounded-xl
px-4
py-3
transition-all
duration-200
"

style={({isActive})=>({

background:isActive
?
colors.active
:
"transparent",

boxShadow:isActive
?
"var(--q-glow)"
:
"none",

color:isActive
?
"#ffffff"
:
colors.text

})}

>


<Icon size={20}/>


<span className="font-medium">

{t(`sidebar.${item.key}`)}

</span>


</NavLink>

);


})

}


</nav>





<div

className="p-4"

style={{

borderTop:`1px solid ${colors.border}`

}}

>


<div

className="
rounded-2xl
p-4
"

style={{

background:colors.surface

}}

>


<div className="flex items-center gap-3">


<img

src={
profile?.avatar_url ||
"https://ui-avatars.com/api/?background=1E88E5&color=ffffff&name=Q"
}

alt=""

className="
h-11
w-11
rounded-full
object-cover
"

/>



<div className="min-w-0 flex-1">


<p

className="
truncate
font-semibold
"

style={{

color:colors.text

}}

>

{profile?.full_name || "Quavron User"}

</p>



<p

className="
truncate
text-xs
"

style={{

color:colors.muted

}}

>

@{profile?.username || "user"}

</p>



</div>


</div>


</div>


</div>


</aside>





{isDesktop && (

<div className="w-72 shrink-0"/>

)}


</>

);

}
