import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import PostManager from "../core/posts/PostManager";
import PostService from "../services/PostService";

const PostContext = createContext(null);

export function PostProvider({ children }) {

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(false);

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

    const post =
      PostManager.createPost(values);

    const { data, error } =
      await PostService.createPost(post);

    if (error) {

      console.error("POST ERROR:", error);

      alert(error.message);

      throw error;

    }

    setPosts((prev) => [
      data,
      ...prev,
    ]);

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
