import { PostContext } from "../context/PostContextProvider";
import { TDeletePostPayload } from "../types/postContext";
import { currentUser } from "../data/data.json";
import { TReplyFormProps } from "./ReplyForm";
import { EPostType } from "../types/post";
import { useContext } from "react";

type TUserControlsProps = {
  id: number;
  parentPostId?: number;
  username: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setDeletePostPayload: React.Dispatch<React.SetStateAction<TDeletePostPayload | undefined>>;
  setReplyPayload: React.Dispatch<React.SetStateAction<TReplyFormProps | undefined>>;
};

export default function UserControls({
  id,
  parentPostId,
  username,
  setShowModal,
  setDeletePostPayload,
  setReplyPayload,
}: TUserControlsProps) {
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
    <div>
      {isCurrentUser ? (
        <>
          <button onClick={() => handleDeletePost(id)}>DELETE</button>
          <button onClick={handleStartEditing}>EDIT</button>
        </>
      ) : (
        <>
          <button onClick={handleStartReplyingTo}>Reply</button>
        </>
      )}
    </div>
  );
}
