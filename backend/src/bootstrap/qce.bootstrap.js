const ConnectorManager = require("../modules/qce/manager");
const connectors = require("../modules/qce/connectors");

async function bootstrapQCE() {
  console.log("[QCE] Initializing...");

  ConnectorManager.initialize(connectors);

  console.log(
    `[QCE] Loaded ${ConnectorManager.list().length} connectors.`
  );

  console.log("[QCE] Ready.");
}

module.exports = bootstrapQCE;
