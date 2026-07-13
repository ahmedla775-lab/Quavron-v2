import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import CommentService from "../services/CommentService";


const CommentsContext =
  createContext(null);



export function CommentsProvider({
  children,
}) {


  const [comments, setComments] =
    useState([]);



  const [loading, setLoading] =
    useState(false);




  async function loadComments(postId) {

    setLoading(true);


    const { data, error } =
      await CommentService.getComments(postId);



    if (!error && data) {

      setComments(data);

    }


    setLoading(false);

  }






  async function createComment(values) {


    const { data, error } =
      await CommentService.createComment(
        values
      );



    if (error) {

      console.error(
        "COMMENT ERROR:",
        error
      );

      throw error;

    }



    setComments((prev)=>[

      ...prev,

      data,

    ]);



    return data;

  }






  async function deleteComment(id) {


    const { error } =
      await CommentService.deleteComment(
        id
      );



    if (error) {

      console.error(error);

      throw error;

    }



    setComments((prev)=>

      prev.filter(
        (comment)=>
          comment.id !== id
      )

    );


  }






  const value =
    useMemo(
      ()=>({

        comments,

        loading,

        loadComments,

        createComment,

        deleteComment,

      }),

      [
        comments,
        loading,
      ]

    );





  return (

    <CommentsContext.Provider
      value={value}
    >

      {children}

    </CommentsContext.Provider>

  );

}






export function useCommentsContext() {


  const context =
    useContext(
      CommentsContext
    );



  if (!context) {

    throw new Error(
      "useCommentsContext must be used inside CommentsProvider"
    );

  }



  return context;


}
