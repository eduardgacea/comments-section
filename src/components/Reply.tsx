import { TDeletePostPayload, TEditPostPayload } from "../types/postContext";
import { PostContext } from "../context/PostContextProvider";
import { TComment, TReply, EPostType } from "../types/post";
import { currentUser } from "../data/data.json";
import { formatDistanceToNow } from "date-fns";
import { TReplyFormProps } from "./ReplyForm";
import { useContext, useState } from "react";

import styles from "./Reply.module.css";
import ScoreButton from "./ScoreButton";

type TReplyProps = {
  reply: TReply;
  comment: TComment;
  setDeletePostPayload: React.Dispatch<React.SetStateAction<TDeletePostPayload | undefined>>;
  setReplyPayload: React.Dispatch<React.SetStateAction<TReplyFormProps | undefined>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Reply({ reply, comment, setDeletePostPayload, setReplyPayload, setShowModal }: TReplyProps) {
  const { editedPostId, startReplyingTo, startEditingPost, editPost } = useContext(PostContext);
  const [editBoxContent, setEditBoxContent] = useState(reply.content);

  const isEditing = editedPostId === reply.id;
  let createdAt: string;

  const postDate = new Date(reply.createdAt).valueOf();
  if (isNaN(postDate)) {
    createdAt = reply.createdAt;
  } else {
    createdAt = `${formatDistanceToNow(postDate)} ago`;
  }

  const handleDeleteReply = (id: number, parentPostId: number) => {
    setShowModal(true);
    setDeletePostPayload({ id, postType: EPostType.REPLY, parentPostId });
  };

  const handleStartReplyingTo = (id: number, parentPostId: number, replyingTo: string) => {
    startReplyingTo(id);
    setReplyPayload({ id, parentPostId, replyingTo });
  };

  const handleStartEditing = () => {
    startEditingPost(reply.id);
  };

  const handleEditReply = () => {
    const payload: TEditPostPayload = {
      id: reply.id,
      postType: EPostType.REPLY,
      parentPostId: comment.id,
      newContent: editBoxContent,
    };

    editPost(payload);
  };

  // factor out to separate component
  const UserControls = isEditing ? (
    <>
      <button onClick={handleEditReply}>UPDATE</button>
    </>
  ) : (
    <>
      <button onClick={() => handleDeleteReply(reply.id, comment.id)}>DELETE</button>
      <button onClick={handleStartEditing}>EDIT</button>
    </>
  );

  return (
    <div className={styles.post}>
      <div className={styles.postHeader}>
        <div className={styles.postDetails}>
          <img src={reply.user.image.png} />
          <div className={styles.username}>{reply.user.username}</div>
          <div className={styles.createdAt}>{createdAt}</div>
        </div>
        <button onClick={() => handleStartReplyingTo(reply.id, comment.id, reply.user.username)}>Reply</button>
      </div>
      {isEditing ? (
        <textarea value={editBoxContent} onChange={(e) => setEditBoxContent(e.target.value)}></textarea>
      ) : (
        <div className={styles.content}>{`@${reply.replyingTo} ${reply.content}`}</div>
      )}
      <div>
        <ScoreButton id={reply.id} parentPostId={comment.id} score={reply.score} />
        <div>{reply.user.username === currentUser.username && UserControls}</div>
      </div>
    </div>
  );
}
