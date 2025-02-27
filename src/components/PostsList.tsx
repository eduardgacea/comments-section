import { useContext } from "react";
import { PostContext } from "../context/PostContextProvider";

import Post from "./Post";

import styles from "./PostsList.module.css";

export default function PostsList() {
  const { comments } = useContext(PostContext);

  return (
    <div className={styles.postsList}>
      {comments.map((comment) => (
        <Post key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
