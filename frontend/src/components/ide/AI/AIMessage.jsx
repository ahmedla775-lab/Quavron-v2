export default function AIMessage({

  role,

  message,

}) {

  const user = role === "user";

  return (

    <div
      className={`my-3 flex ${
        user
          ? "justify-end"
          : "justify-start"
      }`}
    >

      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 ${
          user
            ? "bg-blue-600 text-white"
            : "bg-slate-800 text-slate-200"
        }`}
      >

        {message}

      </div>

    </div>

  );

}

