import { PostContext } from "../context/PostContextProvider";
import { TDeletePostPayload } from "../types/postContext";
import { currentUser } from "../data/data.json";
import { TNewReplyProps } from "./NewReply";
import { EPostType } from "../types/post";
import { useContext } from "react";

import styles from "./MessageControls.module.css";

type TMessageControlsProps = {
  id: number;
  parentPostId?: number;
  username: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setDeletePostPayload: React.Dispatch<React.SetStateAction<TDeletePostPayload | undefined>>;
  setReplyPayload: React.Dispatch<React.SetStateAction<TNewReplyProps | undefined>>;
};

export default function MessageControls({
  id,
  parentPostId,
  username,
  setShowModal,
  setDeletePostPayload,
  setReplyPayload,
}: TMessageControlsProps) {
  const { startEditingPost, startReplyingTo } = useContext(PostContext);

  const isCurrentUser = username === currentUser.username;

  const handleDeletePost = (id: number) => {
    setShowModal(true);
    if (!parentPostId) {
      setDeletePostPayload({ id, postType: EPostType.COMMENT });
    } else {
      setDeletePostPayload({ id, postType: EPostType.REPLY, parentPostId });
    }
  };

  const handleStartEditing = () => {
    startEditingPost(id);
  };

  const handleStartReplyingTo = () => {
    startReplyingTo(id);
    if (!parentPostId) {
      setReplyPayload({ id, parentPostId: id, replyingTo: username });
    } else {
      setReplyPayload({ id, parentPostId, replyingTo: username });
    }
  };

  return (
    <div className={styles.controls}>
      {isCurrentUser ? (
        <>
          <button className={`${styles.control} ${styles.delete}`} onClick={() => handleDeletePost(id)}>
            <img src="images/icon-delete.svg" />
            <span>Delete</span>
          </button>
          <button className={`${styles.control} ${styles.edit}`} onClick={handleStartEditing}>
            <img src="images/icon-edit.svg" />
            <span>Edit</span>
          </button>
        </>
      ) : (
        <>
          <button className={`${styles.control} ${styles.edit}`} onClick={handleStartReplyingTo}>
            <img src="images/icon-reply.svg" />
            <span>Reply</span>
          </button>
        </>
      )}
    </div>
  );
}
