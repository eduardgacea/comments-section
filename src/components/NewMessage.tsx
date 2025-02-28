import { PostContext } from "../context/PostContextProvider";
import { useMessageType } from "../hooks/useMessageType";
import { useContext, useEffect, useRef } from "react";
import { currentUser } from "../data/data.json";
import { EPostType } from "../types/post";

import Button from "./Button";

import styles from "./NewMessage.module.css";

type TNewMessageProps = {
  confirmMessage: string;
  placeholder?: string;
  newMessage: string;
  messageType: EPostType;
  replyingTo?: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  clickHandler: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function NewMessage({
  confirmMessage,
  placeholder,
  newMessage,
  messageType,
  replyingTo,
  setNewMessage,
  clickHandler,
}: TNewMessageProps) {
  const { isReplyingTo } = useContext(PostContext);
  const ref = useRef<HTMLTextAreaElement>(null);

  const replyingToType = useMessageType(isReplyingTo);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (messageType === EPostType.COMMENT) {
      setNewMessage(e.target.value);
    } else if (messageType === EPostType.REPLY) {
      const newValue = e.target.value;
      if (!newValue.startsWith(`@${replyingTo} `)) {
        setNewMessage(`@${replyingTo} `);
      } else {
        setNewMessage(newValue);
      }
    }
  };

  useEffect(() => {
    if (replyingTo && ref.current && messageType === EPostType.REPLY) {
      ref.current.focus();
      ref.current.setSelectionRange(replyingTo.length + 2, replyingTo.length + 2);
    }
  }, [messageType, replyingTo]);

  return (
    <div className={`${styles.newMessage} ${replyingToType === EPostType.REPLY && styles.newReply}`}>
      <textarea value={newMessage} onChange={handleChange} placeholder={placeholder} ref={ref}></textarea>
      <div className={styles.userActions}>
        <img className={styles.avatar} src={currentUser.image.png} />
        <Button onClick={clickHandler}>{confirmMessage}</Button>
      </div>
    </div>
  );
}
