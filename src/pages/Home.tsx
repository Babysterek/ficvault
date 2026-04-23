import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
    const [stories, setStories] = useState<any[]>([]);
    const [filter, setFilter] = useState("all");

    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        const { data } = await supabase
            .from("stories")
            .select("*")
            .order("created_at", { ascending: false });

        setStories(data || []);
    };

    /* 🔥 FILTER LOGIC */
    const filteredStories = stories.filter((s) => {
        if (filter === "fanfiction") return !s.is_drabble;
        if (filter === "drabble") return s.is_drabble;
        return true;
    });

    return (
        <div className="home">

            {/* 🔝 TOP NAV */}
            <div className="topbar">

                <div className="logo">✦ FicVault</div>

                <div className="nav">
                    <button className="active">Home</button>
                    <button>Fanfictions</button>
                    <button>Drabbles</button>
                    <button onClick={() => navigate("/bookmarks")}>
                        Bookmarks
                    </button>
                </div>

                <div className="right">
                    <input placeholder="Search stories..." />
                    <div className="avatar">U</div>
                </div>

            </div>

            {/* 🧱 LAYOUT */}
            <div className="layout">

                {/* 🧱 SIDEBAR */}
                <div className="sidebar">

                    <div className="card">
                        <h3>Welcome back!</h3>
                        <p>Glad to have you in the vault.</p>

                        {role === "admin" && (
                            <button
                                className="primary"
                                onClick={() => navigate("/new")}
                            >
                                + New Story
                            </button>
                        )}

                        <button
                            className="secondary"
                            onClick={() => navigate("/bookmarks")}
                        >
                            View My Stories
                        </button>
                    </div>

                    <div className="card">
                        <h3>Categories</h3>
                        <ul>
                            <li>Romance</li>
                            <li>Fantasy</li>
                            <li>Mystery</li>
                            <li>Angst</li>
                            <li>Fluff</li>
                        </ul>
                    </div>

                </div>

                {/* 📚 MAIN */}
                <div className="main">

                    <h2>Explore Stories</h2>
                    <p>Dive into imagination.</p>

                    {/* 🔥 FILTERS */}
                    <div className="filters">
                        <button
                            className={filter === "all" ? "active" : ""}
                            onClick={() => setFilter("all")}
                        >
                            All Stories
                        </button>

                        <button
                            className={filter === "fanfiction" ? "active" : ""}
                            onClick={() => setFilter("fanfiction")}
                        >
                            Fanfictions
                        </button>

                        <button
                            className={filter === "drabble" ? "active" : ""}
                            onClick={() => setFilter("drabble")}
                        >
                            Drabbles
                        </button>
                    </div>

                    <h3>Recently Added</h3>

                    {/* 🔥 EMPTY STATE */}
                    {filteredStories.length === 0 ? (
                        <div className="empty">
                            <p>No stories yet in your vault.</p>

                            {role === "admin" && (
                                <button onClick={() => navigate("/new")}>
                                    Create Your First Story
                                </button>
                            )}
                        </div>
                    ) : (

                        <div className="grid">

                            {filteredStories.map((story) => (
                                <div
                                    key={story.id}
                                    className="story-card"
                                    onClick={() => navigate(`/story/${story.id}`)}
                                >

                                    <div className="cover" />

                                    <div className="content">

                                        <span
                                            className={
                                                story.is_drabble ? "tag drabble" : "tag fanfic"
                                            }
                                        >
                                            {story.is_drabble ? "DRABBLE" : "FANFICTION"}
                                        </span>

                                        <h4>{story.title}</h4>

                                        <p className="author">by Babysterek</p>

                                        <p className="desc">
                                            {story.summary || "No description"}
                                        </p>

                                        <div className="stats">
                                            <span>👁 {story.views || 0}</span>
                                            <span>⭐ {story.likes || 0}</span>
                                            <span>⏱ 3 min</span>
                                        </div>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}