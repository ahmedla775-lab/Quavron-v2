const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const API_KEY = process.env.YOUTUBE_API_KEY;

const channelsFile = path.join(
  __dirname,
  "../channels.json"
);

const backupFile = path.join(
  __dirname,
  "../channels.backup.json"
);


async function resolveChannelIds() {

  if (!API_KEY) {
    console.error("Missing YOUTUBE_API_KEY");
    process.exit(1);
  }


  const channels = JSON.parse(
    fs.readFileSync(channelsFile, "utf8")
  );


  // إنشاء نسخة احتياطية
  fs.writeFileSync(
    backupFile,
    JSON.stringify(channels, null, 2)
  );


  const updated = [];


  for (const channel of channels) {

    // إذا كان له ID لا نعيد البحث
    if (channel.channelId) {
      updated.push(channel);
      continue;
    }


    try {

      console.log(
        "Searching:",
        channel.name
      );


      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            key: API_KEY,
            part: "snippet",
            q: channel.name,
            type: "channel",
            maxResults: 5
          }
        }
      );


      const items = response.data.items || [];


      if (items.length > 0) {

        const result = items[0];

        updated.push({
          ...channel,
          channelId: result.id.channelId,
          verified: false
        });


        console.log(
          "FOUND:",
          result.id.channelId
        );


      } else {

        updated.push({
          ...channel,
          verified: false
        });


        console.log(
          "NOT FOUND:",
          channel.name
        );
      }


    } catch (error) {

      console.error(
        "ERROR:",
        channel.name,
        error.response?.data || error.message
      );


      updated.push(channel);

    }

  }


  fs.writeFileSync(
    channelsFile,
    JSON.stringify(
      updated,
      null,
      2
    )
  );


  console.log(
    "channels.json updated"
  );

  console.log(
    "Backup created:",
    backupFile
  );

}


resolveChannelIds();
