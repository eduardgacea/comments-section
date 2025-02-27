import { PostContext } from "../context/PostContextProvider";
import { useContext, useState } from "react";
import { currentUser } from "../data/data.json";

import Button from "./Button";

import styles from "./NewComment.module.css";

export default function NewComment() {
  const [newComment, setNewComment] = useState("");

  const { newPost } = useContext(PostContext);

  const handleSend = () => {
    if (newComment === "") return;
    newPost(newComment);
    setNewComment("");
  };

  return (
    <div className={styles.newComment}>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
      ></textarea>
      <div className={styles.userActions}>
        <img className={styles.avatar} src={currentUser.image.png} />
        <Button onClick={handleSend}>SEND</Button>
      </div>
    </div>
  );
}
