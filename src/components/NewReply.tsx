import { PostContext } from "../context/PostContextProvider";
import { TReplyPayload } from "../types/postContext";
import { useContext, useState } from "react";
import { EPostType } from "../types/post";

import NewMessage from "./NewMessage";

export type TNewReplyProps = {
  id: number;
  parentPostId: number;
  replyingTo: string;
};

export default function NewReply({ id, parentPostId, replyingTo }: TNewReplyProps) {
  const { endReplyingTo, addReply } = useContext(PostContext);
  const [replyContent, setReplyContent] = useState(`@${replyingTo} `);

  const handleAddReply = () => {
    const content = replyContent.replace(`@${replyingTo} `, "");
    if (content === "") return;
    const replyPayload: TReplyPayload = {
      content,
      replyingTo,
      parentPostId,
    };
    addReply(replyPayload);
    endReplyingTo();
  };

  if (!id || !parentPostId) return null;

  return (
    <NewMessage
      confirmMessage="REPLY"
      newMessage={replyContent}
      messageType={EPostType.REPLY}
      replyingTo={replyingTo}
      setNewMessage={setReplyContent}
      clickHandler={handleAddReply}
    />
  );
}
