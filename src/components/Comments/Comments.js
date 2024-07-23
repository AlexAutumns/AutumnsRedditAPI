import React from "react";
import Comment from "./Comment.js";

import "./Comments.css"

function Comments(props) {
    return (
        <div className="comments-container">
            <div className="comment-list">
                {props.comments.map((comment, index) => (
                    <Comment comment={comment} key={index} />
                ))}
            </div>
        </div>
    );
}

export default Comments;
