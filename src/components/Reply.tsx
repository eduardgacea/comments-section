import { PostContext } from "../context/PostContextProvider";
import { TDeletePostPayload } from "../types/postContext";
import { TComment, TReply } from "../types/post";
import { currentUser } from "../data/data.json";
import { formatDistanceToNow } from "date-fns";
import { TReplyFormProps } from "./ReplyForm";
import { useContext, useState } from "react";

import UserControls from "./UserControls";
import ScoreButton from "./ScoreButton";

import styles from "./Reply.module.css";

type TReplyProps = {
  reply: TReply;
  comment: TComment;
  setDeletePostPayload: React.Dispatch<React.SetStateAction<TDeletePostPayload | undefined>>;
  setReplyPayload: React.Dispatch<React.SetStateAction<TReplyFormProps | undefined>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Reply({ reply, comment, setDeletePostPayload, setReplyPayload, setShowModal }: TReplyProps) {
  const { editedPostId } = useContext(PostContext);
  const [editBoxContent, setEditBoxContent] = useState(reply.content);

  const isEditing = editedPostId === reply.id;
  const isCurrentUser = reply.user.username === currentUser.username;
  let createdAt: string;

  const postDate = new Date(reply.createdAt).valueOf();
  if (isNaN(postDate)) {
    createdAt = reply.createdAt;
  } else {
    createdAt = `${formatDistanceToNow(postDate)} ago`;
  }

  return (
    <div className={styles.post}>
      <div className={styles.postHeader}>
        <div className={styles.postDetails}>
          <img src={reply.user.image.png} />
          <div className={styles.username}>{reply.user.username}</div>
          {isCurrentUser && <div>you</div>}
          <div className={styles.createdAt}>{createdAt}</div>
        </div>
        <UserControls
          id={reply.id}
          parentPostId={comment.id}
          username={reply.user.username}
          setShowModal={setShowModal}
          setDeletePostPayload={setDeletePostPayload}
          setReplyPayload={setReplyPayload}
        />
      </div>
      {isEditing ? (
        <textarea value={editBoxContent} onChange={(e) => setEditBoxContent(e.target.value)}></textarea>
      ) : (
        <div className={styles.content}>{`@${reply.replyingTo} ${reply.content}`}</div>
      )}
      <div>
        <ScoreButton id={reply.id} parentPostId={comment.id} score={reply.score} />
      </div>
    </div>
  );
}
