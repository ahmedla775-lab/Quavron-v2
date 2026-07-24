const fs = require("fs");
const path = require("path");


const CACHE_FILE = path.join(
  __dirname,
  "youtube-cache.json"
);


const TTL = 60 * 60 * 1000; // ساعة


class YouTubeCache {


  get(){

    if(!fs.existsSync(CACHE_FILE)){
      return null;
    }


    try {

      const cache =
        JSON.parse(
          fs.readFileSync(
            CACHE_FILE,
            "utf8"
          )
        );


      if(
        Date.now() - cache.timestamp < TTL
      ){

        return cache.data;

      }


      return null;


    } catch {

      return null;

    }

  }



  set(data){

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

  }

}


module.exports = new YouTubeCache();
