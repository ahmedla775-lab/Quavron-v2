const Parser = require("rss-parser");
const fs = require("fs");
const path = require("path");

const BaseConnector = require("../BaseConnector");
const ContentModel = require("../../types/ContentModel");

const channels = require("./channels.json");


const CACHE_FILE = path.join(
  __dirname,
  "cache",
  "youtube-cache.json"
);


const CACHE_TTL = 60 * 60 * 1000; // 1 hour


class YouTubeConnector extends BaseConnector {

  constructor() {

    super("youtube");

    this.parser = new Parser();

  }



  async fetchFeed(options = {}) {

    return this.fetchTrending(options);

  }




  async fetchTrending(options = {}) {


    const cached = this.getCache();


    if (cached) {

      console.log("[YouTube] Cache HIT");

      return cached;

    }


    console.log("[YouTube] Cache MISS");


    const results = [];



    for (const channel of channels) {


      if (!channel.channelId) {

        console.log(
          `[YouTube] Missing channelId: ${channel.name}`
        );

        continue;

      }



      try {


        const feed = await this.parser.parseURL(

          `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.channelId}`

        );



        for (const item of (feed.items || []).slice(0, 5)) {


          const videoId =

            item.id?.replace("yt:video:", "") ||

            item.link?.match(/v=([^&]+)/)?.[1] ||

            item.link?.match(/shorts\/([^?]+)/)?.[1] ||

            "";



          results.push(

            new ContentModel({

              id: videoId,

              externalId: videoId,

              source: "youtube",

              type: "video",

              title: item.title,

              content: item.contentSnippet || "",

              author: feed.title || channel.name,

              url: item.link,

              thumbnail:

                item.mediaThumbnail?.url ||

                item.enclosure?.url ||

                "",

              publishedAt: item.pubDate,


              metadata: {

                category: channel.category,

                language: channel.language,

                priority: channel.priority,

                trustScore: channel.trustScore

              }

            })

          );


        }



      } catch (error) {


        console.error(

          `[YouTube RSS] ${channel.name}:`,

          error.message

        );


      }


    }



    console.log(

      "[YouTube] videos:",

      results.length

    );



    this.saveCache(results);



    return results;


  }





  getCache() {


    try {


      if (!fs.existsSync(CACHE_FILE)) {

        return null;

      }



      const cache = JSON.parse(

        fs.readFileSync(

          CACHE_FILE,

          "utf8"

        )

      );



      if (

        Date.now() - cache.timestamp

        <

        CACHE_TTL

      ) {


        return cache.data;


      }



      return null;



    } catch (error) {


      return null;


    }


  }





  saveCache(data) {


    try {


      const dir = path.dirname(CACHE_FILE);



      if (!fs.existsSync(dir)) {

        fs.mkdirSync(

          dir,

          { recursive: true }

        );

      }



      fs.writeFileSync(

        CACHE_FILE,

        JSON.stringify(

          {

            timestamp: Date.now(),

            data

          },

          null,

          2

        )

      );



    } catch(error) {


      console.error(

        "[YouTube Cache Error]",

        error.message

      );


    }


  }



}



module.exports = YouTubeConnector;
