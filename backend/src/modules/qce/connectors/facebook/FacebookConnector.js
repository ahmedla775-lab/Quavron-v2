const axios = require("axios");
const BaseConnector = require("../BaseConnector");
const ContentModel = require("../../types/ContentModel");

class FacebookConnector extends BaseConnector {

  constructor() {
    super("facebook");

    this.api = "https://graph.facebook.com/v21.0";

    this.token = process.env.FACEBOOK_ACCESS_TOKEN;
  }


  async fetchFeed(options = {}) {

    return this.fetchPublicContent(options);

  }


  async fetchTrending(options = {}) {

    return this.fetchPublicContent(options);

  }


  async fetchPublicContent(options = {}) {

    try {

      if (!this.token) {

        console.warn(
          "[FacebookConnector] Missing FACEBOOK_ACCESS_TOKEN"
        );

        return [];

      }


      /*
        هنا نضع معرف الصفحة العامة لاحقاً
        مثال:
        quavron.page.id
      */

      const pageId = process.env.FACEBOOK_PAGE_ID;

      if (!pageId) {

        console.warn(
          "[FacebookConnector] No pageId provided"
        );

        return [];

      }


      const response = await axios.get(
        `${this.api}/${pageId}/feed`,
        {
          params: {
            access_token: this.token,

            fields:
              "id,message,created_time,full_picture,permalink_url,type"

          }
        }
      );


      return response.data.data.map(post => {

        return new ContentModel({

          id: `facebook-${post.id}`,

          externalId: post.id,

          source: "facebook",

          type:
            post.type === "video"
              ? "video"
              : "post",


          title:
            post.message
              ? post.message.substring(0,80)
              : "Facebook Post",


          content:
            post.message || "",


          url:
            post.permalink_url || "",


          thumbnail:
            post.full_picture || "",


          publishedAt:
            post.created_time

        });

      });


    } catch(error) {

      console.error(
        "[FacebookConnector]",
        error.response?.data || error.message
      );

      return [];

    }

  }

}


module.exports = FacebookConnector;
