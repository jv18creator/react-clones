import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./Post.css";
import { db } from "./firebase";
import firebase from "firebase";
//rfce shortcut
function Post({ postId, user, username, caption, imgUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment('');
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          alt={username}
          className="post__avatar"
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>
      {/* Header > avatar + username */}
      <img className="post__image" src={imgUrl} alt="post" />
      {/* Main Image(post) */}
      <h3 className="post__name">
        <strong>{username}:</strong> {caption}
      </h3>

      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>

      {/* username + caption */}
      {user && (
        <form>
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            onClick={postComment}
            type="submit"
            className="post__button"
            disabled={!comment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
