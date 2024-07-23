import React, { useState, useEffect } from "react";
import "./Article.css";
import he from "he";

import Comments from "../Comments/Comments.js";

// icons
import commentIcon from "../../images/icons/comment_16dp_FF8800_FILL0_wght400_GRAD0_opsz20.svg";
import shareIcon from "../../images/icons/share_16dp_FF8800_FILL0_wght400_GRAD0_opsz20.svg";
import linkIcon from "../../images/icons/link_16dp_FF8800_FILL0_wght400_GRAD0_opsz20.svg";
import checkIcon from "../../images/icons/check_16dp_FF8800_FILL0_wght400_GRAD0_opsz20.svg";

function Article(props) {
    let iframeDimensions = [640, 360];

    // share stuff
    const [copied, setCopied] = useState(false);
    const handleShare = () => {
        navigator.clipboard.writeText(
            `https://reddit.com${props.article.data.permalink}`
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // Reset copied state after 2 seconds
        console.log(
            `copied link: https://reddit.com${props.article.data.permalink}`
        );
    };

    // modal stuff
    const [showModal, setShowModal] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState("");
    const openModal = (imageUrl) => {
        setModalImageUrl(imageUrl);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
    };

    // comment stuff
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);

    // get comments fix this
    useEffect(() => {
        if (showComments) {
            fetch(`https://www.reddit.com/r/${props.article.data.subreddit}/comments/${props.article.data.id}.json`)
                .then((res) => {
                    if (res.status !== 200) {
                        console.log('subreddit comment error');
                    }
                    res.json().then(data => {
                        if (data != null && data[1].data.children) {
                            console.log(`Post's Comments:`)
                            console.log(data[1].data.children);
                            setComments(data[1].data.children);
                        }
                    });
                });
        }
    }, [showComments, props.article.data.subreddit, props.article.data.id]);
    
    

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    // render media stuff
    /* Youtube embed link */ const getYouTubeEmbedLink = (url) => {
        let videoId = "";
        if (url.includes("watch")) {
            const urlParams = new URLSearchParams(new URL(url).search);
            videoId = urlParams.get("v");
        } else {
            videoId = url.split("/").pop();
        }

        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        return embedUrl;
    };

    /* gallery embed link */
    const getRedditGallery = (articleData) => {
        // articleData input is props.article.data
        const extractedImages = [];

        const galleryDataItems = articleData.gallery_data.items;

        for (const item of galleryDataItems) {
            const itemData = articleData.media_metadata[item.media_id];
            if (itemData.status == "failed") {
                console.log(
                    `Failed to load gallery image media_id: ${item.media_id}`
                );
                continue;
            }

            switch (itemData.e) {
                case "Image":
                    const previews = itemData.p;
                    extractedImages.push([itemData.s.u, itemData.e]);
                    break; // Add break to exit switch case after processing Image
            }
        }

        return extractedImages; // Return the extracted images array
    };

    const renderMedia = () => {
        const articleDataUrl = props.article.data.url;

        if (
            articleDataUrl.includes("youtube") ||
            articleDataUrl.includes("youtu.be")
        ) {
            const embedUrl = getYouTubeEmbedLink(articleDataUrl);
            return (
                <iframe
                    width={iframeDimensions[0]} // used to be 480
                    height={iframeDimensions[1]}
                    src={
                        embedUrl
                        // used to be props.article.data.secure_media.oembed.html.match(/src="([^"]+)"/)[1] // fix when i go to different subreddits
                    }
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Embedded youtube"
                    className="article-media"
                />
            );
        } else if (
            articleDataUrl.includes("reddit") ||
            articleDataUrl.includes("redd.it")
        ) {
            if (props.article.data.is_gallery) {
                // gallery render

                const postGallery = getRedditGallery(props.article.data);

                return (
                    // fix gallery here

                    <div className="gallery">
                        {postGallery
                            ? postGallery.map((galleryItem, index) => {
                                  if (galleryItem[1] === "Image") {
                                      const decodedURL = he.decode(
                                          galleryItem[0]
                                      ); // Decode HTML entities
                                      return (
                                          <img
                                              key={index}
                                              src={decodedURL}
                                              alt="Image"
                                              className="article-media"
                                              style={{ width: "100%" }}
                                              onClick={() =>
                                                  openModal(decodedURL)
                                              }
                                          />
                                      );
                                  } else if (
                                      galleryItem[1] === "AnimatedImage"
                                  ) {
                                      return <p key={index}>Animated Image</p>;
                                  }
                                  return null; // Handle other types of items if needed
                              })
                            : null}
                    </div>
                );
            } else if (props.article.data.is_video) {
                // video render
                return (
                    <iframe
                        width={iframeDimensions[0]} // used to be 480
                        height={iframeDimensions[1]}
                        src={
                            props.article.data.media.reddit_video.fallback_url
                            // used to be props.article.data.secure_media.oembed.html.match(/src="([^"]+)"/)[1] // fix when i go to different subreddits
                        }
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Embedded video"
                        className="article-media"
                    />
                );
            } else if (articleDataUrl.includes("comments")) {
                return;
            } else {
                return (
                    // single image render
                    <img
                        src={articleDataUrl}
                        className="article-media"
                        style={{ maxWidth: "50%" }}
                        onClick={() => openModal(articleDataUrl)}
                    />
                );
            }
        } else {
            const outsideUrl = articleDataUrl;
            return (
                // outside url
                <a href={outsideUrl} target="_blank" className="outside-url">
                    {outsideUrl}
                </a>
            );
        }
    };

    return (
        <div className="post-container">
            <article>
                <a
                    href={`https://reddit.com${props.article.data.permalink}`}
                    target="_blank"
                >
                    <h3>{props.article.data.title}</h3>
                </a>
                <div>
                    <p>{props.article.over_18}</p>
                </div>

                {showModal && (
                    <div className="modal" onClick={closeModal}>
                        <img
                            src={modalImageUrl}
                            className="modal-image"
                            alt="Enlarged Preview"
                        />
                    </div>
                )}
                <div className="media-container">{renderMedia()}</div>

                <div className="article-info">
                    <div className="info-component">
                        <p>Upvotes: {props.article.data.score}</p>
                    </div>

                    <div className="info-component">
                        <button type="button" onClick={handleShare}>
                            {copied ? (
                                <img src={checkIcon} />
                            ) : (
                                <img src={shareIcon} />
                            )}
                        </button>
                    </div>

                    <div className="info-component">
                        <button type="button" onClick={toggleComments}>
                            <img src={commentIcon} />{" "}
                            {props.article.data.num_comments}
                        </button>
                    </div>
                </div>
            </article>
            {showComments && (
                <div className="comment-section">
                    <button type="button" onClick={toggleComments}>
                        Close Comments
                    </button>
                    <Comments
                        comments={comments}
                        post={[
                            props.article.data.title,
                            `https://reddit.com${props.article.data.permalink}`,
                        ]}
                    />
                </div>
            )}
        </div>
    );
}

export default Article;
