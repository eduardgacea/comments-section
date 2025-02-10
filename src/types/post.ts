import { TUser } from "./user";

export enum EPostType {
  COMMENT = "COMMENT",
  REPLY = "REPLY",
}

export type TPost = {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: TUser;
};

export type TReply = TPost & {
  replyingTo: string;
};

export type TComment = TPost & {
  replies: TReply[];
};
