const bootstrap = require("../src/bootstrap");
const app = require("../src/app");

let initialized = false;

module.exports = async (req, res) => {
  if (!initialized) {
    await bootstrap();
    initialized = true;
  }

  return app(req, res);
};
