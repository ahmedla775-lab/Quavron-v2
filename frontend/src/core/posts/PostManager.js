import { v4 as uuid } from "uuid";

class PostManager {

  createPost({
    authorId,
    content,
    visibility = "public",
    type = "post",
    reel_config = null,
    video_config = null,
  }) {

    return {

      id: uuid(),

      author_id: authorId,

      content,

      visibility,
      type,

      content_format:
        type === "reel"
          ? "short_video"
          : type === "video"
          ? "video"
          : "post",

      display_mode:
        type === "reel"
          ? "vertical"
          : "normal",

      is_reel: type === "reel",
      is_video: type === "video",

      reel_config:
        type === "reel"
          ? reel_config
          : null,

      video_config:
        type === "video"
          ? video_config
          : null,

      likes_count: 0,

      comments_count: 0,

      shares_count: 0,

      created_at: new Date().toISOString(),

    };

  }

}

export default new PostManager();
