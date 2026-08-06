export default function AIMessage({message, role}) {

  const user = role === "user";


  return (

    <div
      className={`
      flex
      ${user ? "justify-end" : "justify-start"}
      `}
    >

      <div
        className={`
        max-w-[80%]
        rounded-3xl
        px-5
        py-3
        whitespace-pre-wrap
        ${
          user
          ?
          "bg-[var(--q-primary)] text-white"
          :
          "bg-[var(--q-card)] text-[var(--q-text)] border border-[var(--q-border)]"
        }
        `}
      >

        {message}

      </div>

    </div>

  );

}
