import { TDeletePostPayload, TEditPostPayload } from "../types/postContext";
import { DeviceContext } from "../context/DeviceContextProvider";
import { useContext, useEffect, useRef, useState } from "react";
import { PostContext } from "../context/PostContextProvider";
import { EPostType, TComment, TReply } from "../types/post";
import { currentUser } from "../data/data.json";
import { formatDistanceToNow } from "date-fns";
import { TNewReplyProps } from "./NewReply";

import MessageControls from "./MessageControls";
import ScoreButton from "./ScoreButton";
import Button from "./Button";

import styles from "./Message.module.css";

function isComment(message: TComment | TReply): message is TComment {
  return (message as TComment).replies !== undefined;
}

type TMessageProps = {
  message: TComment | TReply;
  parentMessage?: TComment;
  setDeletePostPayload: React.Dispatch<React.SetStateAction<TDeletePostPayload | undefined>>;
  setReplyPayload: React.Dispatch<React.SetStateAction<TNewReplyProps | undefined>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Message({
  message,
  parentMessage,
  setDeletePostPayload,
  setReplyPayload,
  setShowModal,
}: TMessageProps) {
  const { isEditingTo, editPost } = useContext(PostContext);
  const { device } = useContext(DeviceContext);
  const [editBoxContent, setEditBoxContent] = useState(
    isComment(message) ? message.content : `@${message.replyingTo} ${message.content}`
  );
  const editRef = useRef<HTMLTextAreaElement>(null);

  const isCurrentUser = message.user.username === currentUser.username;
  const isEditing = message.id === isEditingTo;
  let timestamp: string;

  const postDate = new Date(message.createdAt).valueOf();
  if (isNaN(postDate)) {
    timestamp = message.createdAt;
  } else {
    timestamp = `${formatDistanceToNow(postDate)} ago`;
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isComment(message)) {
      setEditBoxContent(e.target.value);
    } else {
      const newValue = e.target.value;
      if (!newValue.startsWith(`@${message.replyingTo} `)) {
        setEditBoxContent(`@${message.replyingTo} `);
      } else {
        setEditBoxContent(newValue);
      }
    }
  };

  const handleEditPost = () => {
    let payload: TEditPostPayload;
    const newContent = editBoxContent.slice(editBoxContent.indexOf(" ") + 1);
    if (newContent === "") return;
    if (!parentMessage) {
      payload = {
        id: message.id,
        postType: EPostType.COMMENT,
        newContent,
      };
    } else {
      payload = {
        id: message.id,
        postType: EPostType.REPLY,
        parentPostId: parentMessage.id,
        newContent,
      };
    }
    editPost(payload);
  };

  useEffect(() => {
    if (isEditing && editRef.current) {
      const textarea = editRef.current;

      const initialHeight = textarea.scrollHeight;
      textarea.style.height = `${initialHeight}px`;
      textarea.style.minHeight = `${initialHeight}px`;
      textarea.style.maxHeight = `${initialHeight}px`;

      const range = editBoxContent.length + (isComment(message) ? 0 : message.replyingTo.length + 2);
      textarea.focus();
      textarea.setSelectionRange(range, range);
    }
  }, [isEditing]);

  if (device === "mobile")
    return (
      <div className={`${parentMessage ? styles.reply : styles.comment}`}>
        <div className={styles.messageHeader}>
          <div className={styles.messageDetails}>
            <img className={styles.avatar} src={message.user.image.png} alt={message.user.username} />
            <div className={styles.username}>{message.user.username}</div>
            {isCurrentUser && <div className={styles.meTag}>you</div>}
            <div className={styles.timestamp}>{timestamp}</div>
          </div>
        </div>
        {isEditing ? (
          <>
            <textarea
              className={styles.editArea}
              value={editBoxContent}
              onChange={handleChange}
              ref={editRef}
            ></textarea>
            <div>
              <Button style={{ float: "right" }} onClick={handleEditPost}>
                UPDATE
              </Button>
            </div>
          </>
        ) : (
          <div className={styles.content}>
            {isComment(message) ? (
              message.content
            ) : (
              <>
                <span className={styles.tag}>@{message.replyingTo}</span> {message.content}
              </>
            )}
          </div>
        )}
        <div className={styles.messageControls}>
          <ScoreButton
            id={message.id}
            parentPostId={parentMessage ? parentMessage.id : undefined}
            score={message.score}
          />
          <MessageControls
            id={message.id}
            parentPostId={parentMessage ? parentMessage.id : undefined}
            username={message.user.username}
            setShowModal={setShowModal}
            setDeletePostPayload={setDeletePostPayload}
            setReplyPayload={setReplyPayload}
          />
        </div>
      </div>
    );

  if (device === "desktop")
    return (
      <div className={`${parentMessage ? styles.reply : styles.comment} ${styles.desktopMessage}`}>
        <ScoreButton
          id={message.id}
          parentPostId={parentMessage ? parentMessage.id : undefined}
          score={message.score}
        />
        <div className={styles.messageContent}>
          <div className={styles.messageHeader}>
            <div className={styles.messageDetails}>
              <img className={styles.avatar} src={message.user.image.png} alt={message.user.username} />
              <div className={styles.username}>{message.user.username}</div>
              {isCurrentUser && <div className={styles.meTag}>you</div>}
              <div className={styles.timestamp}>{timestamp}</div>
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
            <>
              <textarea
                className={styles.editArea}
                value={editBoxContent}
                onChange={handleChange}
                ref={editRef}
              ></textarea>
              <div>
                <Button style={{ float: "right" }} onClick={handleEditPost}>
                  UPDATE
                </Button>
              </div>
            </>
          ) : (
            <div className={styles.content}>
              {isComment(message) ? (
                message.content
              ) : (
                <>
                  <span className={styles.tag}>@{message.replyingTo}</span> {message.content}
                </>
              )}
            </div>
          )}
          <div className={styles.messageControls}></div>
        </div>
      </div>
    );
}
