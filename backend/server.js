require("dotenv").config();

const app = require("./src/app");
const config = require("./src/config/server");
const bootstrap = require("./src/bootstrap");

async function start() {
  await bootstrap();

  app.listen(config.port, () => {
    console.log(`Quavron API listening on port ${config.port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
