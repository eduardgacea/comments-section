import { PostContext } from "../context/PostContextProvider";
import { TReplyPayload } from "../types/postContext";
import { useContext, useState } from "react";

export type TReplyFormProps = {
  id: number;
  parentPostId: number;
  replyingTo: string;
};

export default function ReplyForm({ id, parentPostId, replyingTo }: TReplyFormProps) {
  const [content, setContent] = useState(`@${replyingTo} `);
  const { endReplyingTo, addReply } = useContext(PostContext);

  const handleAddReply = () => {
    const replyPayload: TReplyPayload = {
      content: content.replace(`@${replyingTo} `, ""),
      replyingTo,
      parentPostId,
    };
    addReply(replyPayload);
    endReplyingTo();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!newValue.startsWith(`@${replyingTo} `)) {
      setContent(`@${replyingTo} `);
    } else {
      setContent(newValue);
    }
  };

  if (!id || !parentPostId) return null;

  return (
    <div>
      <textarea value={content} onChange={handleChange} placeholder="your reply here..."></textarea>
      <button onClick={handleAddReply}>Reply</button>
    </div>
  );
}
