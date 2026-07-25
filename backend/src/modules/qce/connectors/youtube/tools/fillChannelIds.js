const axios = require("axios");
const fs = require("fs");
const path = require("path");

const channelsFile = path.join(
  __dirname,
  "../channels.json"
);

const backupFile = path.join(
  __dirname,
  "../channels.backup.json"
);


async function getChannelId(name) {

  try {

    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(name + " youtube channel")}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0"
      }
    });


    const html = response.data;


    const match = html.match(
      /"channelId":"(UC[a-zA-Z0-9_-]{22})"/
    );


    if (match) {
      return match[1];
    }


    return null;


  } catch(error) {

    console.log(
      "Search error:",
      name,
      error.message
    );

    return null;

  }

}



async function run() {


  const channels = JSON.parse(
    fs.readFileSync(
      channelsFile,
      "utf8"
    )
  );


  fs.writeFileSync(
    backupFile,
    JSON.stringify(
      channels,
      null,
      2
    )
  );


  console.log(
    "Backup created"
  );


  for (const channel of channels) {


    if (channel.channelId) {

      continue;

    }


    console.log(
      "Searching:",
      channel.name
    );


    const id = await getChannelId(
      channel.name
    );


    if (id) {


      channel.channelId = id;


      console.log(
        "FOUND:",
        id
      );


    } else {


      console.log(
        "NOT FOUND:",
        channel.name
      );


    }


    await new Promise(
      r => setTimeout(r, 1500)
    );


  }


  fs.writeFileSync(
    channelsFile,
    JSON.stringify(
      channels,
      null,
      2
    )
  );


  console.log(
    "channels.json updated"
  );


}


run();
