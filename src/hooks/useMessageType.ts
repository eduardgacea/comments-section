import { PostContext } from "../context/PostContextProvider";
import { EPostType } from "../types/post";
import { useContext } from "react";

export function useMessageType(id: number | undefined): EPostType | undefined {
  const { comments } = useContext(PostContext);

  if (!id || !comments) return undefined;
  return comments.filter((comment) => comment.id === id).length ? EPostType.COMMENT : EPostType.REPLY;
}
