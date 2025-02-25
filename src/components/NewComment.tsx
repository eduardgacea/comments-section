import { PostContext } from "../context/PostContextProvider";
import { useContext, useState } from "react";

export default function NewComment() {
  const [newComment, setNewComment] = useState("");

  const { newPost } = useContext(PostContext);

  const handleSend = () => {
    if (newComment === "") return;
    newPost(newComment);
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
