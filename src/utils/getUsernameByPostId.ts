import { TComment } from "../types/post";

export function getUsernameByPostId(comments: TComment[], id: number): string {
  const comment = comments.find((comment) => comment.id === id);
  if (comment) {
    return comment.user.username;
  }

  for (const comment of comments) {
    const reply = comment.replies.find((reply) => reply.id === id);
    if (reply) {
      return reply.user.username;
    }
  }

  return "";
}
