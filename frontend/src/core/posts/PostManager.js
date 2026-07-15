import { v4 as uuid } from "uuid";

class PostManager {

  createPost({
    authorId,
    content,
    visibility = "public",
  }) {

    return {

      id: uuid(),

      author_id: authorId,

      content,

      visibility,

      likes_count: 0,

      comments_count: 0,

      shares_count: 0,

      created_at: new Date().toISOString(),

    };

  }

}

export default new PostManager();
