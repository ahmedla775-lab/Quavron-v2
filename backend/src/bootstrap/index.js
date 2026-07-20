const bootstrapQCE = require("./qce.bootstrap");

async function bootstrap() {
  await bootstrapQCE();
}

module.exports = bootstrap;
