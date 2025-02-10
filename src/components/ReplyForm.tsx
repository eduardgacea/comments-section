import { PostContext } from "../context/PostContextProvider";
import { useContext, useState } from "react";
import { TReplyPayload } from "../types/postContext";

export type TReplyFormProps = {
  id: number | undefined;
  parentPostId: number | undefined;
  replyingTo: string;
};

export default function ReplyForm({ id, parentPostId, replyingTo }: TReplyFormProps) {
  const [content, setContent] = useState("");
  const { endReplyingTo, addReply } = useContext(PostContext);

  if (!id || !parentPostId) return null;

  const handleAddReply = () => {
    const replyPayload: TReplyPayload = {
      content,
      replyingTo,
      parentPostId,
    };
    addReply(replyPayload);
    endReplyingTo();
  };

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="your reply here..."
      ></textarea>
      <button onClick={handleAddReply}>Reply</button>
    </div>
  );
}
