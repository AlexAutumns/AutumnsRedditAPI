import React, { useState, useEffect, useRef } from "react";
import "./App.css";

import Article from "./components/Article/Article";
import NotesComponent from "./components/Notes/Notes";

import Logo from "./images/icons/AutumnRedditLogo.png";
import SearchIcon from "./images/icons/search_16dp_FF8800_FILL0_wght400_GRAD0_opsz20.svg";

function App() {
    const [articles, setArticles] = useState([]);
    const [subreddit, setSubreddit] = useState("hololive");

    const [searchBar, setSearchBar] = useState(subreddit);
    const [articleLimit, setArticleLimit] = useState(20);

    useEffect(() => {
        let url = "";
        if (subreddit.toLowerCase() === "home" || subreddit === "") {
            url = `https://www.reddit.com/.json?limit=${articleLimit}`;
        } else {
            url = `https://www.reddit.com/r/${subreddit}.json?limit=${articleLimit}`;
        }

        fetch(url)
            .then((res) => {
                if (res.status !== 200) {
                    console.log("subreddit json error");
                }

                res.json().then((data) => {
                    if (data != null && data.data.children) {
                        console.log("Subreddit posts:")
                        console.log(data.data)
                        setArticles(data.data.children);
                    }
                });
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [subreddit, articleLimit]);

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Update the search term and subreddit
        setSubreddit(searchBar);
    };

    const handleLoadMore = () => {
        console.log(`Loading more posts...`);
        setArticleLimit((prev) => prev + 10);
        console.log(`Posts Loaded: ${articleLimit}`);
    };

    const observer = useRef();
    const lastArticleRef = useRef();

    const handleObserver = (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
            handleLoadMore();
        }
    };

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "20px",
            threshold: 1.0,
        };

        observer.current = new IntersectionObserver(handleObserver, options);

        if (lastArticleRef.current) {
            observer.current.observe(lastArticleRef.current);
        }

        return () => observer.current.disconnect();
    }, [articles]);

    return (
        <div className="App">
            <header>
                <h1>
                    Autumn
                    <img src={Logo} className="logo" />
                    <a href="https://www.reddit.com" target="_blank" id="reddit-link">
                        Reddit
                    </a>
                </h1>
                <form className="reddit-location" onSubmit={handleSubmit}>
                    <button type="submit">
                        <img src={SearchIcon} />
                    </button>
                    <p>
                        {searchBar.toLowerCase() === "home" || searchBar === ""
                            ? ""
                            : "r/"}
                    </p>
                    <input
                        type="text"
                        className="input"
                        value={
                            searchBar == "home" || searchBar == ""
                                ? ""
                                : searchBar
                        }
                        onChange={(e) => setSearchBar(e.target.value)}
                    />
                </form>
            </header>

            <NotesComponent />

            <div className="articles-page">
                <div className="articles">
                    {articles != null
                        ? articles.map((article, index) => (
                              <Article
                                  key={index}
                                  article={article}
                              />
                          ))
                        : ""}
                </div>

                <div ref={lastArticleRef}></div>
            </div>
        </div>
    );
}

export default App;
