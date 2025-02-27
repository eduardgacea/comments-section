import { useContext, useEffect, useRef, useState } from "react";
import { PostContext } from "../context/PostContextProvider";
import { TReplyPayload } from "../types/postContext";

export type TReplyFormProps = {
  id: number;
  parentPostId: number;
  replyingTo: string;
};

export default function ReplyForm({ id, parentPostId, replyingTo }: TReplyFormProps) {
  const { isReplyingTo, endReplyingTo, addReply } = useContext(PostContext);
  const [content, setContent] = useState(`@${replyingTo} `);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  const isReplying = id === isReplyingTo;

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

  useEffect(() => {
    if (isReplying && replyRef.current) {
      replyRef.current.focus();
      replyRef.current.setSelectionRange(replyingTo.length + 2, replyingTo.length + 2);
    }
  }, [isReplying, replyingTo.length]);

  if (!id || !parentPostId) return null;

  return (
    <div>
      <textarea value={content} onChange={handleChange} ref={replyRef}></textarea>
      <button onClick={handleAddReply}>Reply</button>
    </div>
  );
}
