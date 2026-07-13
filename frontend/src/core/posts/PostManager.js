import { v4 as uuid } from "uuid";

class PostManager {

  createPost({
    authorId,
    content,
    visibility = "public",
    mediaUrl = null,
    mediaType = null,
  }) {

    return {

      id: uuid(),

      author_id: authorId,

      content,

      media_url: mediaUrl,

      media_type: mediaType,

      visibility,

      likes_count: 0,

      comments_count: 0,

      shares_count: 0,

      created_at: new Date().toISOString(),

    };

  }

}

export default new PostManager();
