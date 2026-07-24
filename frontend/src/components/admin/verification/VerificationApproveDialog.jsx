import { useState } from "react";

const TYPES = [

  {
    id: "blue",
    title: "Blue Verification",
    icon: "🔵",
    description: "Official public figure",
  },

  {
    id: "gray",
    title: "Gray Verification",
    icon: "⚪",
    description: "Government / Organization",
  },

  {
    id: "gold",
    title: "Gold Verification",
    icon: "🟡",
    description: "Business",
  },

  {
    id: "star",
    title: "Star Verification",
    icon: "⭐",
    description: "Premium account",
  },

];

export default function VerificationApproveDialog({

  open,

  onClose,

  onApprove,

}) {

  const [type, setType] = useState("blue");

  if (!open) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <div className="w-full max-w-xl rounded-3xl bg-slate-900 p-8">

        <h2 className="mb-6 text-2xl font-bold text-white">

          Approve Verification

        </h2>

        <div className="space-y-3">

          {TYPES.map((item) => (

            <button

              key={item.id}

              onClick={() => setType(item.id)}

              className={`

                w-full

                rounded-2xl

                border

                p-4

                text-left

                transition

                ${
                  type === item.id
                    ? "border-blue-500 bg-blue-600/20"
                    : "border-slate-700 bg-slate-800"
                }

              `}

            >

              <div className="flex items-center gap-3">

                <span className="text-2xl">

                  {item.icon}

                </span>

                <div>

                  <h3 className="font-semibold text-white">

                    {item.title}

                  </h3>

                  <p className="text-sm text-slate-400">

                    {item.description}

                  </p>

                </div>

              </div>

            </button>

          ))}

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button

            onClick={onClose}

            className="rounded-xl bg-slate-700 px-5 py-3 text-white"

          >

            Cancel

          </button>

          <button

            onClick={() => onApprove(type)}

            className="rounded-xl bg-blue-600 px-6 py-3 text-white"

          >

            Approve

          </button>

        </div>

      </div>

    </div>

  );

}
