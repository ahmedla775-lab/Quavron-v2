const FILE_TEMPLATES = {

  js: `console.log("Hello Quavron");`,

  jsx: `export default function Component() {
  return (
    <div>

    </div>
  );
}
`,

  ts: `export {};`,

  tsx: `export default function Component() {
  return (
    <div>

    </div>
  );
}
`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Quavron</title>
</head>
<body>

</body>
</html>
`,

  css: `body {

  margin: 0;

  padding: 0;

  box-sizing: border-box;

}
`,

  json: `{

}
`,

  md: `# New File

`,

  txt: ``,

};

export default FILE_TEMPLATES;
