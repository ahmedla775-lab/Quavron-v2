import {
  Eye,
  EyeOff,
  GripVertical,
  Pencil,
  Save,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

export default function SectionCard({

  icon: Icon,

  title,

  description,

  enabled = true,

  onEdit,

  onToggle,

}) {

  return (

    <Card className="p-6">

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-4">

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-xl
              bg-[var(--q-primary)]
              text-white
            "
          >

            <Icon size={26} />

          </div>

          <div>

            <h3
              className="
                text-xl
                font-bold
                text-[var(--q-text)]
              "
            >
              {title}
            </h3>

            <p
              className="
                mt-2
                text-sm
                text-[var(--q-muted)]
              "
            >
              {description}
            </p>

          </div>

        </div>

        <GripVertical
          size={20}
          className="text-[var(--q-muted)]"
        />

      </div>

      <div className="mt-8 flex flex-wrap gap-3">

        <button
          onClick={onEdit}
          className="
            rounded-xl
            border
            border-[var(--q-border)]
            px-4
            py-2
            hover:bg-[var(--q-card)]
          "
        >
          <div className="flex items-center gap-2">

            <Pencil size={16} />

            Edit

          </div>

        </button>

        <button
          onClick={onToggle}
          className="
            rounded-xl
            border
            border-[var(--q-border)]
            px-4
            py-2
            hover:bg-[var(--q-card)]
          "
        >

          <div className="flex items-center gap-2">

            {enabled
              ? <Eye size={16}/>
              : <EyeOff size={16}/>
            }

            {enabled
              ? "Visible"
              : "Hidden"
            }

          </div>

        </button>

        <button
          className="
            rounded-xl
            bg-[var(--q-primary)]
            px-4
            py-2
            text-white
          "
        >

          <div className="flex items-center gap-2">

            <Save size={16}/>

            Save

          </div>

        </button>

      </div>

    </Card>

  );

}
