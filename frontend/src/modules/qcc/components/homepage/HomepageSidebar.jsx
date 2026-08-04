import {
  Home,
  Flag,
  Cpu,
  Boxes,
  Factory,
  Image,
  FileText,
  Phone,
} from "lucide-react";

const sections = [

  {
    id: "hero",
    title: "Hero",
    icon: Home,
  },

  {
    id: "vision",
    title: "Company Vision",
    icon: Flag,
  },

  {
    id: "technology",
    title: "Technologies",
    icon: Cpu,
  },

  {
    id: "products",
    title: "Products & Services",
    icon: Boxes,
  },

  {
    id: "industry",
    title: "Industrial Division",
    icon: Factory,
  },

  {
    id: "media",
    title: "Media Gallery",
    icon: Image,
  },

  {
    id: "documents",
    title: "Official Documents",
    icon: FileText,
  },

  {
    id: "contact",
    title: "Contact",
    icon: Phone,
  },

];

export default function HomepageSidebar() {

  return (

    <aside
      className="
        w-80
        rounded-2xl
        border
        border-[var(--q-border)]
        bg-[var(--q-card)]
        p-6
      "
    >

      <h2
        className="
          text-xl
          font-bold
          text-[var(--q-text)]
        "
      >
        Homepage Structure
      </h2>

      <p
        className="
          mt-2
          text-sm
          text-[var(--q-muted)]
        "
      >
        Official sections of the public website.
      </p>

      <div className="mt-8 space-y-3">

        {sections.map((section) => {

          const Icon = section.icon;

          return (

            <button
              key={section.id}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                border
                border-[var(--q-border)]
                px-4
                py-3
                text-left
                transition-all
                hover:bg-[var(--q-bg)]
              "
            >

              <Icon
                size={20}
                className="text-[var(--q-primary)]"
              />

              <span
                className="
                  font-medium
                  text-[var(--q-text)]
                "
              >
                {section.title}
              </span>

            </button>

          );

        })}

      </div>

    </aside>

  );

}
