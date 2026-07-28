import { useRef } from "react";

export default function ImageUploader({

  accept = "image/*",

  onSelect,

  children,

}) {

  const inputRef = useRef(null);

  function open() {

    inputRef.current?.click();

  }

  async function handleChange(e) {

    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {

      alert("Please select an image.");

      return;

    }

    await onSelect(file);

    e.target.value = "";

  }

  return (

    <>

      <input

        ref={inputRef}

        hidden

        type="file"

        accept={accept}

        onChange={handleChange}

      />

      <div

        onClick={open}

        className="cursor-pointer"

      >

        {children}

      </div>

    </>

  );

}
