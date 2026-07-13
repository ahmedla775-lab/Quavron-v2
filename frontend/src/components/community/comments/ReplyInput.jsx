import { useState } from "react";


export default function ReplyInput({
  onSubmit,
  onCancel,
}) {

  const [content, setContent] =
    useState("");


  async function handleSubmit() {

    if (!content.trim()) return;

    await onSubmit(content);

    setContent("");

  }


  return (

    <div className="mt-3">

      <textarea

        value={content}

        onChange={(e) =>
          setContent(e.target.value)
        }

        rows="2"

        placeholder="Write a reply..."

        className="w-full rounded-xl bg-slate-800 p-3 text-white outline-none"

      />


      <div className="mt-2 flex justify-end gap-2">


        <button

          onClick={onCancel}

          className="rounded-lg px-3 py-1 text-sm text-slate-400"

        >

          Cancel

        </button>


        <button

          onClick={handleSubmit}

          className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white"

        >

          Reply

        </button>


      </div>


    </div>

  );

}
