import { PostContext } from "../context/PostContextProvider";
import { useContext, useState } from "react";
import { EPostType } from "../types/post";

import NewMessage from "./NewMessage";

export default function NewComment() {
  const [newComment, setNewComment] = useState("");

  const { newPost } = useContext(PostContext);

  const handleSend = () => {
    if (newComment === "") return;
    newPost(newComment);
    setNewComment("");
  };

  return (
    <NewMessage
      confirmMessage="SEND"
      placeholder="Add a comment..."
      newMessage={newComment}
      messageType={EPostType.COMMENT}
      setNewMessage={setNewComment}
      clickHandler={handleSend}
    />
  );
}
