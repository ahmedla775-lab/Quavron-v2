import AIMessage from "./AIMessage";

export default function AIHistory({

  messages,

}) {

  return (

    <div className="flex-1 overflow-y-auto p-4">

      {

        messages.map((message) => (

          <AIMessage

            key={message.id}

            role={message.role}

            message={message.message}

          />

        ))

      }

    </div>

  );

}

