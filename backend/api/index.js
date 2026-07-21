const app = require("../src/app");
const bootstrap = require("../src/bootstrap");

let ready = false;

module.exports = async (req, res) => {
  try {
    if (!ready) {
      await bootstrap();
      ready = true;
    }

    return app(req, res);
  } catch (err) {
    console.error(err);

    res.statusCode = 500;
    res.end("Internal Server Error");
  }
};
