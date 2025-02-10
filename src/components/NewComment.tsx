import { PostContext } from "../context/PostContextProvider";
import { useContext, useState } from "react";

export default function NewComment() {
  const [newComment, setNewComment] = useState("");

  const { postComment } = useContext(PostContext);

  const handleSend = () => {
    if (newComment === "") return;
    postComment(newComment);
    setNewComment("");
  };

  return (
    <div>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
      ></textarea>
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
