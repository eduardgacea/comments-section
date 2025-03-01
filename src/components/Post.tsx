import { PostContext } from "../context/PostContextProvider";
import { TDeletePostPayload } from "../types/postContext";
import { TNewReplyProps } from "./NewReply";
import { useState, useContext } from "react";
import { TComment } from "../types/post";

import NewReply from "./NewReply";
import Message from "./Message";
import Modal from "./Modal";
import React from "react";

import styles from "./Post.module.css";

type TPostProps = { comment: TComment };

export default function Post({ comment }: TPostProps) {
  const [deletePostPayload, setDeletePostPayload] = useState<TDeletePostPayload | undefined>();
  const [replyPayload, setReplyPayload] = useState<TNewReplyProps | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);

  const { isReplyingTo } = useContext(PostContext);

  return (
    <>
      {showModal && <Modal deletePostPayload={deletePostPayload} setShowModal={setShowModal} />}
      <Message
        message={comment}
        setDeletePostPayload={setDeletePostPayload}
        setReplyPayload={setReplyPayload}
        setShowModal={setShowModal}
      />
      {isReplyingTo === comment.id && replyPayload && (
        <NewReply id={replyPayload.id} parentPostId={replyPayload.parentPostId} replyingTo={replyPayload.replyingTo} />
      )}

      {comment.replies.length > 0 && (
        <div className={styles.repliesList}>
          <div className={styles.repliesListDecorator}></div>
          <div className={styles.replies}>
            {comment.replies.map((reply) => (
              <React.Fragment key={reply.id}>
                <Message
                  message={reply}
                  parentMessage={comment}
                  setDeletePostPayload={setDeletePostPayload}
                  setReplyPayload={setReplyPayload}
                  setShowModal={setShowModal}
                />
                {isReplyingTo === reply.id && replyPayload && (
                  <NewReply
                    id={replyPayload.id}
                    parentPostId={replyPayload.parentPostId}
                    replyingTo={replyPayload.replyingTo}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
