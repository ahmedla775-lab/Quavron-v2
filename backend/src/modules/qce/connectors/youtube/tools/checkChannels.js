const channels = require("../channels.json");


const missing = channels.filter(
  c => !c.channelId
);


console.log(
  "Total channels:",
  channels.length
);


console.log(
  "Missing IDs:",
  missing.length
);


missing.forEach(
  c => console.log("-", c.name)
);
