import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import PostManager from "../core/posts/PostManager";
import PostService from "../services/PostService";
import PostMediaService from "../modules/community/services/PostMediaService";

const PostContext = createContext(null);

export function PostProvider({ children }) {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  async function loadPosts() {

    setLoading(true);

    const { data, error } =
      await PostService.getPosts();

    if (!error && data) {
      setPosts(data);
    }

    setLoading(false);

  }

  async function createPost(values) {

    const {
      files = [],
      ...postValues
    } = values;

    console.log("CREATE POST VALUES:", values);
    console.log("FILES:", files);

    const post =
      PostManager.createPost(postValues);

    const { data, error } =
      await PostService.createPost(post);

    if (error) {

      console.error("POST ERROR:", error);
      alert(error.message);
      throw error;

    }

    if (files.length > 0) {

      try {

        setUploadProgress(10);

        await PostMediaService.uploadAll(
          post.id,
          files,
          post.author_id,
          (progress)=>setUploadProgress(progress)
        );

        setUploadProgress(100);

      } catch (error) {

        console.error(error);
      alert(JSON.stringify(error, null, 2));
        alert(error.message);

      }

    }

    await loadPosts();
    setUploadProgress(0);

    return data;

  }

  async function updatePost(id, values) {

    const { data, error } =
      await PostService.updatePost(
        id,
        values
      );

    if (error) {

      console.error(error);
      alert(error.message);
      throw error;

    }

    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? data
          : post
      )
    );

    return data;

  }

  async function deletePost(id) {

    const { error } =
      await PostService.deletePost(id);

    if (error) {

      console.error(error);
      alert(error.message);
      throw error;

    }

    setPosts((prev) =>
      prev.filter(
        (post) => post.id !== id
      )
    );

  }

  const value = useMemo(
    () => ({
      posts,
      loading,
      uploadProgress,
      loadPosts,
      createPost,
      updatePost,
      deletePost,
    }),
    [
      posts,
      loading,
    ]
  );

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );

}

export function usePosts() {

  const context =
    useContext(PostContext);

  if (!context) {

    throw new Error(
      "usePosts must be used inside PostProvider"
    );

  }

  return context;

}
