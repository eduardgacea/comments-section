import {
  TDeletePostPayload,
  TEditPostPayload,
  TPostContextAction,
  TPostContextState,
  TRatePostPayload,
  TReplyPayload,
} from "../types/postContext";
import { comments as initialComments, currentUser } from "../data/data.json";
import { createContext, useCallback, useEffect, useReducer } from "react";
import { EPostType, TComment, TReply } from "../types/post";

const initialState: TPostContextState = {
  comments: [],
  likedCommentsIds: [],
  dislikedCommentsIds: [],
  isReplyingTo: undefined,
  isEditingTo: undefined,
  newPost: () => {},
  ratePost: () => {},
  deletePost: () => {},
  startReplyingTo: () => {},
  endReplyingTo: () => {},
  addReply: () => {},
  startEditingPost: () => {},
  endEditingPost: () => {},
  editPost: () => {},
};

const PostContext = createContext<TPostContextState>(initialState);

function reducer(prevState: TPostContextState, action: TPostContextAction): TPostContextState {
  switch (action.type) {
    case "loadComments":
      return { ...prevState, comments: [...initialComments] };

    case "newPost": {
      const newComment: TComment = {
        id: Date.now(),
        content: action.payload,
        createdAt: new Date().toISOString(),
        score: 0,
        user: currentUser,
        replies: [],
      };
      return { ...prevState, comments: [...prevState.comments, newComment] };
    }

    case "ratePost": {
      const { id, postType, rating } = action.payload;

      const isLiked = prevState.likedCommentsIds.includes(id);
      const isDisliked = prevState.dislikedCommentsIds.includes(id);
      const addingLike = rating === 1;
      let deltaScore: number;
      let newState: TPostContextState | undefined;

      if (isLiked && !addingLike) deltaScore = -2;
      else if ((isLiked && addingLike) || (!isLiked && !isDisliked && !addingLike)) deltaScore = -1;
      else if ((!isDisliked && !isLiked && addingLike) || (isDisliked && !addingLike)) deltaScore = 1;
      else if (isDisliked && addingLike) deltaScore = 2;
      else deltaScore = 0;

      if (postType === EPostType.COMMENT) {
        newState = {
          ...prevState,
          comments: prevState.comments.map((comment) =>
            comment.id === id ? { ...comment, score: comment.score + deltaScore } : comment
          ),
        };
      } else if (postType === EPostType.REPLY) {
        const { parentPostId } = action.payload;
        newState = {
          ...prevState,
          comments: prevState.comments.map((comment) =>
            comment.id === parentPostId
              ? {
                  ...comment,
                  replies: comment.replies.map((reply) =>
                    reply.id === id ? { ...reply, score: reply.score + deltaScore } : reply
                  ),
                }
              : comment
          ),
        };
      }
      if (!newState) return prevState;

      // removing existing like -> deltaScore = -1
      if (isLiked && addingLike)
        return {
          ...newState,
          likedCommentsIds: prevState.likedCommentsIds.filter((likeId) => likeId !== id),
        };
      // adding new like -> deltaScore +1
      if (!isDisliked && !isLiked && addingLike)
        return {
          ...newState,
          likedCommentsIds: [...prevState.likedCommentsIds, id],
        };
      // adding like over existing dislike -> deltaScore = +2
      if (isDisliked && addingLike)
        return {
          ...newState,
          likedCommentsIds: [...prevState.likedCommentsIds, id],
          dislikedCommentsIds: prevState.dislikedCommentsIds.filter((dislikeId) => dislikeId !== id),
        };
      // removing existing dislike -> deltaScore = +1
      if (isDisliked && !addingLike)
        return {
          ...newState,
          dislikedCommentsIds: prevState.dislikedCommentsIds.filter((dislikeId) => dislikeId !== id),
        };
      // adding new dislike -> deltaScore = -1
      if (!isLiked && !isDisliked && !addingLike)
        return { ...newState, dislikedCommentsIds: [...prevState.dislikedCommentsIds, id] };
      // adding dislike over existing like -> deltaScore = -2
      if (isLiked && !addingLike)
        return {
          ...newState,
          likedCommentsIds: prevState.likedCommentsIds.filter((likeId) => likeId !== id),
          dislikedCommentsIds: [...prevState.dislikedCommentsIds, id],
        };
      return prevState;
    }

    case "deletePost": {
      const { id, postType } = action.payload;

      if (postType === EPostType.COMMENT) {
        return {
          ...prevState,
          comments: prevState.comments.filter((comment) => comment.id !== id),
          likedCommentsIds: prevState.likedCommentsIds.filter((commentId) => commentId !== id),
          dislikedCommentsIds: prevState.dislikedCommentsIds.filter((commentId) => commentId !== id),
        };
      } else if (postType === EPostType.REPLY) {
        const { parentPostId } = action.payload;
        return {
          ...prevState,
          comments: prevState.comments.map((comment) =>
            comment.id === parentPostId
              ? { ...comment, replies: comment.replies.filter((reply) => reply.id !== id) }
              : comment
          ),
          likedCommentsIds: prevState.likedCommentsIds.filter((commentId) => commentId !== id),
          dislikedCommentsIds: prevState.dislikedCommentsIds.filter((commentId) => commentId !== id),
        };
      } else {
        return prevState;
      }
    }

    case "startReplyingTo":
      return { ...prevState, isReplyingTo: action.payload };

    case "endReplyingTo":
      return { ...prevState, isReplyingTo: undefined };

    case "addReply": {
      const { content, parentPostId, replyingTo } = action.payload;

      const newReply: TReply = {
        id: Date.now(),
        content,
        createdAt: new Date().toISOString(),
        score: 0,
        user: currentUser,
        replyingTo,
      };

      return {
        ...prevState,
        comments: prevState.comments.map((comment) =>
          comment.id === parentPostId ? { ...comment, replies: [...comment.replies, newReply] } : comment
        ),
        isReplyingTo: undefined,
      };
    }

    case "startEditingPost":
      return { ...prevState, isEditingTo: action.payload };

    case "endEditingPost":
      return { ...prevState, isEditingTo: undefined };

    case "editPost": {
      const { id, postType, newContent } = action.payload;

      if (postType === EPostType.COMMENT) {
        return {
          ...prevState,
          comments: prevState.comments.map((comment) =>
            comment.id === id ? { ...comment, content: newContent } : comment
          ),
          isEditingTo: undefined,
        };
      } else if (postType === EPostType.REPLY) {
        const { parentPostId } = action.payload;
        return {
          ...prevState,
          comments: prevState.comments.map((comment) =>
            comment.id === parentPostId
              ? {
                  ...comment,
                  replies: comment.replies.map((reply) =>
                    reply.id === id ? { ...reply, content: newContent } : reply
                  ),
                }
              : comment
          ),
          isEditingTo: undefined,
        };
      }

      return prevState;
    }

    default:
      return prevState;
  }
}

function PostContextProvider({ children }: { children: React.ReactNode }) {
  const [{ comments, likedCommentsIds, dislikedCommentsIds, isReplyingTo, isEditingTo }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const loadComments = useCallback(() => dispatch({ type: "loadComments" }), []);
  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const newPost = (content: string) => dispatch({ type: "newPost", payload: content });
  const ratePost = (payload: TRatePostPayload) => dispatch({ type: "ratePost", payload });
  const deletePost = (payload: TDeletePostPayload) => dispatch({ type: "deletePost", payload });
  const startReplyingTo = (id: number) => dispatch({ type: "startReplyingTo", payload: id });
  const endReplyingTo = () => dispatch({ type: "endReplyingTo" });
  const addReply = (payload: TReplyPayload) => dispatch({ type: "addReply", payload });
  const startEditingPost = (id: number) => dispatch({ type: "startEditingPost", payload: id });
  const endEditingPost = () => dispatch({ type: "endEditingPost" });
  const editPost = (payload: TEditPostPayload) => dispatch({ type: "editPost", payload });

  return (
    <PostContext.Provider
      value={{
        comments,
        likedCommentsIds,
        dislikedCommentsIds,
        isReplyingTo,
        isEditingTo,
        newPost,
        ratePost,
        deletePost,
        startReplyingTo,
        endReplyingTo,
        addReply,
        startEditingPost,
        endEditingPost,
        editPost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export { PostContext, PostContextProvider };
