import { PostContext } from "../context/PostContextProvider";
import { TDeletePostPayload } from "../types/postContext";
import { useContext } from "react";

import styles from "./Modal.module.css";
import Button from "./Button";

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
        <div className={styles.title}>Delete comment</div>
        <div className={styles.body}>
          Are you sure you want to delete this comment? This will remove the comment and can't be undone.
        </div>
        <div className={styles.controls}>
          <Button style={{ flex: 1, backgroundColor: "var(--clr-black-100)" }} onClick={handleCancelDelete}>
            NO, CANCEL
          </Button>
          <Button style={{ flex: 1, backgroundColor: "var(--clr-red-300)" }} onClick={handleDeletePost}>
            YES, DELETE
          </Button>
        </div>
      </div>
    </>
  );
}
