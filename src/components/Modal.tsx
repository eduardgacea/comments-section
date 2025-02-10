import { PostContext } from "../context/PostContextProvider";
import { TDeletePostPayload } from "../types/postContext";
import { useContext } from "react";

import styles from "./Modal.module.css";

type TModalProps = {
  deletePostPayload: TDeletePostPayload | undefined;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Modal({ deletePostPayload, setShowModal }: TModalProps) {
  const { deletePost } = useContext(PostContext);

  const handleDeletePost = () => {
    if (!deletePostPayload) return;
    deletePost(deletePostPayload);
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className={styles.overlay} onClick={() => setShowModal(false)}></div>
      <div className={styles.modal}>
        <div>Delete comment</div>
        <div>Are you sure you want to delete this comment?</div>
        <div>
          <button onClick={handleCancelDelete}>No, cancel</button>
          <button onClick={handleDeletePost}>Yes, delete</button>
        </div>
      </div>
    </>
  );
}
