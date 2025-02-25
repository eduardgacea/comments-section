import { PostContext } from "../context/PostContextProvider";
import { TDeletePostPayload } from "../types/postContext";
import { TComment, TReply } from "../types/post";
import { currentUser } from "../data/data.json";
import { formatDistanceToNow } from "date-fns";
import { TReplyFormProps } from "./ReplyForm";
import { useContext, useState } from "react";

import MessageControls from "./MessageControls";
import ScoreButton from "./ScoreButton";

import styles from "./Message.module.css";

function isComment(message: TComment | TReply): message is TComment {
  return (message as TComment).replies !== undefined;
}

type TMessageProps = {
  message: TComment | TReply;
  parentMessage?: TComment;
  setDeletePostPayload: React.Dispatch<React.SetStateAction<TDeletePostPayload | undefined>>;
  setReplyPayload: React.Dispatch<React.SetStateAction<TReplyFormProps | undefined>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Message({
  message,
  parentMessage,
  setDeletePostPayload,
  setReplyPayload,
  setShowModal,
}: TMessageProps) {
  const { isEditingTo } = useContext(PostContext);

  const [editBoxContent, setEditBoxContent] = useState(message.content);

  const isCurrentUser = message.user.username === currentUser.username;
  const isEditing = message.id === isEditingTo;
  let timestamp: string;

  const postDate = new Date(message.createdAt).valueOf();
  if (isNaN(postDate)) {
    timestamp = message.createdAt;
  } else {
    timestamp = `${formatDistanceToNow(postDate)} ago`;
  }

  return (
    <div className={styles.post}>
      <div className={styles.postHeader}>
        <div className={styles.postDetails}>
          <img src={message.user.image.png} />
          <div className={styles.username}>{message.user.username}</div>
          {isCurrentUser && <div>you</div>}
          <div className={styles.createdAt}>{timestamp}</div>
        </div>
        <MessageControls
          id={message.id}
          parentPostId={parentMessage ? parentMessage.id : undefined}
          username={message.user.username}
          setShowModal={setShowModal}
          setDeletePostPayload={setDeletePostPayload}
          setReplyPayload={setReplyPayload}
        />
      </div>
      {isEditing ? (
        <textarea value={editBoxContent} onChange={(e) => setEditBoxContent(e.target.value)}></textarea>
      ) : (
        <div className={styles.content}>
          {isComment(message) ? message.content : `@${message.replyingTo} ${message.content}`}
        </div>
      )}
      <div>
        <ScoreButton
          id={message.id}
          parentPostId={parentMessage ? parentMessage.id : undefined}
          score={message.score}
        />
      </div>
    </div>
  );
}
