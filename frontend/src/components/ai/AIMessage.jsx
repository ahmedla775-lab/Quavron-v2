export default function AIMessage({message, role}) {

  return (
    <div className={`ai-message ${role}`}>
      {message}
    </div>
  );

}
