import React, { useState } from "react";

import "./Notes.css";

const NotesComponent = () => {
    const [showAbout, setShowAbout] = useState(false);
    const [showDrawbacks, setShowDrawbacks] = useState(false);
    const [showPersonalLinks, setShowPersonalLinks] = useState(false);

    const toggleAbout = () => {
        setShowAbout(!showAbout);
    };

    const toggleDrawbacks = () => {
        setShowDrawbacks(!showDrawbacks);
    };

    const togglePersonalLinks = () => {
        setShowPersonalLinks(!showPersonalLinks);
    };

    const closeWindow = (item) => {
        if (item == "about") {
            setShowAbout(false);
        } else if (item == "drawbacks") {
            setShowDrawbacks(false);
        } else if (item == "personal-links") {
            setShowPersonalLinks(false);
        }
    };

    return (
        <div className="notes">
            <div className="buttons-container">
                <button type="button" onClick={toggleAbout}>
                    ABOUT
                </button>
                <button type="button" onClick={toggleDrawbacks}>
                    LIMITATIONS
                </button>
                <button type="button" onClick={togglePersonalLinks}>
                    LINKS
                </button>
            </div>
            <div className="note-list">
                {showAbout && (
                    <div className="note about">
                        <div className="note-body">
                            <h3>About</h3>
                            <p>
                                This is a website where you can scroll through{" "}
                                <a
                                    href="https://www.reddit.com"
                                    target="_blank"
                                >
                                    Reddit
                                </a>{" "}
                                with a new look
                            </p>{" "}
                            <p>I made this for a portfolio project</p>
                        </div>

                        {(showAbout || showDrawbacks) && (
                            <button
                                type="button"
                                className="close-window"
                                onClick={(e) => closeWindow("about")}
                            >
                                X
                            </button>
                        )}
                    </div>
                )}
                {showDrawbacks && (
                    <div className="note drawbacks">
                        <div className="note-body">
                            <h3>Limitations / Drawbacks</h3>
                            <ul>
                                <li>You can't upvote</li>
                                <li>You can't comment</li>
                                <li>
                                    You can only search for subreddits in the
                                    search bar
                                </li>
                                <li>
                                    If you look closely, you will see that the
                                    background image is not seamless.
                                </li>

                                <li>
                                    <a
                                        href="https://www.reddit.com"
                                        target="_blank"
                                    >
                                        Reddit
                                    </a>{" "}
                                    video previews don't have any audio unless
                                    you go to the post. (The post is always
                                    linked; just click the title of the post.)
                                </li>
                            </ul>
                            <p>
                                Why does it have these limitations / drawbacks?
                                Well, it's mostly because I couldn't update them
                                without using{" "}
                                <a
                                    href="https://www.reddit.com/dev/api"
                                    target="_blank"
                                >
                                    Reddit's API
                                </a>
                                , which now requires a fee. Implementing those
                                functions seems difficult without Reddit API. As
                                for the other features, I couldn't figure out
                                how to implement them. :D
                            </p>
                        </div>
                        {(showAbout || showDrawbacks) && (
                            <button
                                type="button"
                                className="close-window"
                                onClick={(e) => closeWindow("drawbacks")}
                            >
                                X
                            </button>
                        )}
                    </div>
                )}

                {showPersonalLinks && (
                    <div className="note personal-links">
                        <div className="note-body">
                            <h3>Personal Links</h3>
                            <ul>
                                <li>
                                    <a
                                        href="https://alexautumns.github.io"
                                        target="_blank"
                                    >
                                        Portfolio
                                    </a>
                                </li>

                                <li>
                                    <a href="" target="_blank">
                                        Github
                                    </a>
                                </li>
                            </ul>
                        </div>
                        {(showAbout || showDrawbacks || showPersonalLinks) && (
                            <button
                                type="button"
                                className="close-window"
                                onClick={(e) => closeWindow("personal-links")}
                            >
                                X
                            </button>
                        )}{" "}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesComponent;
