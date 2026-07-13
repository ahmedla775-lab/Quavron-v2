import { useAuth } from "../../../components/auth/AuthProvider";

import LikeService from "../services/LikeService";
import ShareService from "../services/ShareService";
import BookmarkService from "../services/BookmarkService";
import NotificationService from "../services/NotificationService";

export default function usePostActions() {

  const { user } = useAuth();

  async function like(post) {

    if (!user) return;

    await LikeService.addLike(
      post.id,
      user.id
    );

    if (post.author_id !== user.id) {

      await NotificationService.createNotification({

        user_id: post.author_id,

        actor_id: user.id,

        type: "like",

        post_id: post.id,

        is_read: false,

      });

    }

  }

  async function unlike(post) {

    if (!user) return;

    await LikeService.removeLike(
      post.id,
      user.id
    );

  }

  async function share(post) {

    if (!user) return;

    await ShareService.sharePost(
      post.id,
      user.id
    );

  }

  async function bookmark(post) {

    if (!user) return;

    await BookmarkService.savePost(
      post.id,
      user.id
    );

  }

  async function removeBookmark(post) {

    if (!user) return;

    await BookmarkService.removeBookmark(
      post.id,
      user.id
    );

  }

  return {

    like,
    unlike,
    share,
    bookmark,
    removeBookmark,

  };

}
