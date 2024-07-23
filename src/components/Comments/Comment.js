import React, { useState, useEffect } from "react";

import Comments from "./Comments";

import "./Comment.css";

function Comment(props) {
    // Replies

    const [replies, setReplies] = useState([]);
    const [showReplies, setShowReplies] = useState(false);

    const toggleReplies = () => {
        setShowReplies(!showReplies);
    };

    useEffect(() => {
        fetch(`https://www.reddit.com${props.comment.data.permalink}.json`)
            .then((res) => {
                if (res.status !== 200) {
                    console.log("subreddit comment error");
                }
                res.json().then((data) => {
                    if (
                        data != null &&
                        data[1].data.children[0].data.replies.data
                    ) {
                        console.log(`${props.comment.data.author}'s Replies:`);
                        console.log(data[1].data.children[0].data.replies.data);
                        setReplies(data[1].data.children[0].data.replies.data);
                    }
                });
            })
            .catch((error) => {
                console.error("Error fetching replies:", error);
            });
    }, [props.comment.data.permalink]);

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
                {replies.children ? (
                    <button type="button" onClick={toggleReplies}>
                        Replies
                    </button>
                ): ""}

                <p>Upvotes: {props.comment.data.ups}</p>
            </div>
            {/* Add  replies */}
            {showReplies && (
                <div className="replies-container">
                    <Comments comments={replies.children} />
                </div>
            )}
        </div>
    );
}

export default Comment;
