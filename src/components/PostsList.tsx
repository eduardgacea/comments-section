import { PostContext } from "../context/PostContextProvider";
import { useContext } from "react";

import Post from "./Post";

export default function PostsList() {
  const { comments } = useContext(PostContext);

  return (
    <div style={{ maxWidth: "40%", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {comments.map((comment) => (
        <Post key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
