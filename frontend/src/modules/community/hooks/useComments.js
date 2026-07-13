import { useState } from "react";

import CommentService from "../services/CommentService";

export default function useComments() {

  const [comments, setComments] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  async function loadComments(postId) {

    setLoading(true);

    const { data, error } =
      await CommentService.getComments(postId);

    if (!error) {

      setComments(data || []);

    } else {

      console.error(error);

    }

    setLoading(false);

  }

  async function createComment(values) {

    const { data, error } =
      await CommentService.createComment(values);

    if (error) {

      console.error(error);

      throw error;

    }

    setComments((prev) => [

      ...prev,

      data,

    ]);

    return data;

  }

  async function deleteComment(id) {

    const { error } =
      await CommentService.deleteComment(id);

    if (error) {

      console.error(error);

      throw error;

    }

    setComments((prev) =>

      prev.filter(

        (comment) => comment.id !== id

      )

    );

  }

  return {

    comments,

    loading,

    loadComments,

    createComment,

    deleteComment,

  };

}
