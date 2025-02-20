import { TDeletePostPayload, TEditPostPayload } from "../types/postContext";
import { PostContext } from "../context/PostContextProvider";
import { EPostType, TComment } from "../types/post";
import { currentUser } from "../data/data.json";
import { TReplyFormProps } from "./ReplyForm";
import { useState, useContext } from "react";

import styles from "./Comment.module.css";
import ScoreButton from "./ScoreButton";

type TCommentProps = {
  comment: TComment;
  setDeletePostPayload: React.Dispatch<React.SetStateAction<TDeletePostPayload | undefined>>;
  setReplyPayload: React.Dispatch<React.SetStateAction<TReplyFormProps>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Comment({ comment, setDeletePostPayload, setReplyPayload, setShowModal }: TCommentProps) {
  const { editedPostId, startReplyingTo, startEditingPost, editPost } = useContext(PostContext);
  const [editBoxContent, setEditBoxContent] = useState(comment.content);

  const isEditing = editedPostId === comment.id;

  const handleDeleteComment = (id: number) => {
    setShowModal(true);
    setDeletePostPayload({ id, postType: EPostType.COMMENT });
  };

  const handleStartReplyingTo = (id: number, parentPostId: number, replyingTo: string) => {
    startReplyingTo(id);
    setReplyPayload({ id, parentPostId, replyingTo });
  };

  const handleStartEditing = () => {
    startEditingPost(comment.id);
  };

  const handleEditComment = () => {
    const payload: TEditPostPayload = {
      id: comment.id,
      postType: EPostType.COMMENT,
      newContent: editBoxContent,
    };

    editPost(payload);
  };

  // factor out to separate component
  const UserControls = isEditing ? (
    <>
      <button onClick={handleEditComment}>UPDATE</button>
    </>
  ) : (
    <>
      <button onClick={() => handleDeleteComment(comment.id)}>DELETE</button>
      <button onClick={handleStartEditing}>EDIT</button>
    </>
  );

  return (
    <div className={styles.post}>
      <div className={styles.postHeader}>
        <div className={styles.postDetails}>
          <img src={comment.user.image.png} />
          <div className={styles.username}>{comment.user.username}</div>
          <div className={styles.createdAt}>{comment.createdAt}</div>
        </div>
        <button onClick={() => handleStartReplyingTo(comment.id, comment.id, comment.user.username)}>Reply</button>
      </div>
      {isEditing ? (
        <textarea value={editBoxContent} onChange={(e) => setEditBoxContent(e.target.value)}></textarea>
      ) : (
        <div className={styles.content}>{comment.content}</div>
      )}
      <div>
        <ScoreButton id={comment.id} score={comment.score} />
        <div>{comment.user.username === currentUser.username && UserControls}</div>
      </div>
    </div>
  );
}
