export default function GitChanges() {

  const files = [
    "src/App.jsx",
    "src/pages/Home.jsx",
    "package.json",
  ];

  return (

    <div className="flex-1 overflow-y-auto">

      {files.map((file) => (

        <div
          key={file}
          className="border-b border-slate-800 px-4 py-3 hover:bg-slate-800"
        >
          {file}
        </div>

      ))}

    </div>

  );

}

