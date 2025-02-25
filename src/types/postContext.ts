import { TComment, EPostType } from "./post";

export type TDeletePostPayload =
  | { id: number; postType: EPostType.COMMENT }
  | { id: number; postType: EPostType.REPLY; parentPostId: number };

export type TRatePostPayload =
  | { id: number; postType: EPostType.COMMENT; rating: 1 | -1 }
  | { id: number; postType: EPostType.REPLY; rating: 1 | -1; parentPostId: number };

export type TEditPostPayload =
  | { id: number; postType: EPostType.COMMENT; newContent: string }
  | { id: number; postType: EPostType.REPLY; parentPostId: number; newContent: string };

export type TReplyPayload = { content: string; replyingTo: string; parentPostId: number };

export type TPostContextState = {
  comments: TComment[];
  likedCommentsIds: number[];
  dislikedCommentsIds: number[];
  isReplyingTo: number | undefined;
  isEditingTo: number | undefined;
  newPost: (content: string) => void;
  ratePost: (payload: TRatePostPayload) => void;
  deletePost: (payload: TDeletePostPayload) => void;
  startReplyingTo: (id: number) => void;
  endReplyingTo: () => void;
  addReply: (payload: TReplyPayload) => void;
  startEditingPost: (id: number) => void;
  endEditingPost: () => void;
  editPost: (payload: TEditPostPayload) => void;
};

export type TPostContextAction =
  | { type: "loadComments" }
  | { type: "newPost"; payload: string }
  | { type: "deletePost"; payload: TDeletePostPayload }
  | { type: "ratePost"; payload: TRatePostPayload }
  | { type: "startReplyingTo"; payload: number }
  | { type: "endReplyingTo" }
  | { type: "addReply"; payload: TReplyPayload }
  | { type: "startEditingPost"; payload: number }
  | { type: "endEditingPost" }
  | { type: "editPost"; payload: TEditPostPayload };
