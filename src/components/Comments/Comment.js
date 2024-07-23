import React, { useState } from "react";

import "./Comment.css";

function Comment(props) {

    return (
        <div className="comment">
            <h4>
                <a
                    href={`https://reddit.com${props.comment.data.permalink}`}
                    target="_blank"
                >
                    {props.comment.data.author}
                </a>
            </h4>
            <div className="comment-body">{props.comment.data.body}</div>
            <div className="comment-info">
                <button type="button">Replies</button>
                <p>Upvotes: {props.comment.data.ups}</p>
            </div>
            {/* Add  replies */}
            <div className="replies-container"></div>
        </div>
    );
}

export default Comment;
