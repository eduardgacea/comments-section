import { PostContext } from "../context/PostContextProvider";
import { TDeletePostPayload } from "../types/postContext";
import { currentUser } from "../data/data.json";
import { formatDistanceToNow } from "date-fns";
import { TReplyFormProps } from "./ReplyForm";
import { useState, useContext } from "react";
import { TComment } from "../types/post";

import UserControls from "./UserControls";
import ScoreButton from "./ScoreButton";

import styles from "./Comment.module.css";

type TCommentProps = {
  comment: TComment;
  setDeletePostPayload: React.Dispatch<React.SetStateAction<TDeletePostPayload | undefined>>;
  setReplyPayload: React.Dispatch<React.SetStateAction<TReplyFormProps | undefined>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Comment({ comment, setDeletePostPayload, setReplyPayload, setShowModal }: TCommentProps) {
  const { editedPostId } = useContext(PostContext);
  const [editBoxContent, setEditBoxContent] = useState(comment.content);

  const isEditing = editedPostId === comment.id;
  const isCurrentUser = comment.user.username === currentUser.username;
  let createdAt: string;

  const postDate = new Date(comment.createdAt).valueOf();
  if (isNaN(postDate)) {
    createdAt = comment.createdAt;
  } else {
    createdAt = `${formatDistanceToNow(postDate)} ago`;
  }

  return (
    <div className={styles.post}>
      <div className={styles.postHeader}>
        <div className={styles.postDetails}>
          <img src={comment.user.image.png} />
          <div className={styles.username}>{comment.user.username}</div>
          {isCurrentUser && <div>you</div>}
          <div className={styles.createdAt}>{createdAt}</div>
        </div>
        <UserControls
          id={comment.id}
          username={comment.user.username}
          setShowModal={setShowModal}
          setDeletePostPayload={setDeletePostPayload}
          setReplyPayload={setReplyPayload}
        />
      </div>
      {isEditing ? (
        <textarea value={editBoxContent} onChange={(e) => setEditBoxContent(e.target.value)}></textarea>
      ) : (
        <div className={styles.content}>{comment.content}</div>
      )}
      <div>
        <ScoreButton id={comment.id} score={comment.score} />
      </div>
    </div>
  );
}
