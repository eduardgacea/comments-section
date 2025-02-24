import { PostContext } from "../context/PostContextProvider";
import { TDeletePostPayload } from "../types/postContext";
import { TReplyFormProps } from "./ReplyForm";
import { useState, useContext } from "react";
import { TComment } from "../types/post";

import styles from "./Post.module.css";

import ReplyForm from "./ReplyForm";
import Comment from "./Comment";
import Modal from "./Modal";
import Reply from "./Reply";
import React from "react";

type TPostProps = { comment: TComment };

export default function Post({ comment }: TPostProps) {
  const [deletePostPayload, setDeletePostPayload] = useState<TDeletePostPayload | undefined>();
  const [replyPayload, setReplyPayload] = useState<TReplyFormProps | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);

  const { isReplyingTo } = useContext(PostContext);

  return (
    <>
      {showModal && <Modal deletePostPayload={deletePostPayload} setShowModal={setShowModal} />}
      <Comment
        comment={comment}
        setDeletePostPayload={setDeletePostPayload}
        setReplyPayload={setReplyPayload}
        setShowModal={setShowModal}
      />
      {isReplyingTo === comment.id && replyPayload && (
        <ReplyForm id={replyPayload.id} parentPostId={replyPayload.parentPostId} replyingTo={replyPayload.replyingTo} />
      )}
      <div>
        <div className={styles.replies}>
          {comment.replies.map((reply) => (
            <React.Fragment key={reply.id}>
              <Reply
                reply={reply}
                comment={comment}
                setDeletePostPayload={setDeletePostPayload}
                setReplyPayload={setReplyPayload}
                setShowModal={setShowModal}
              />
              {isReplyingTo === reply.id && replyPayload && (
                <ReplyForm
                  id={replyPayload.id}
                  parentPostId={replyPayload.parentPostId}
                  replyingTo={replyPayload.replyingTo}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
