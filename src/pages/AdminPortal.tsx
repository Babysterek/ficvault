import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getStories,
    deleteStory,
} from "../api";

export default function AdminPortal() {
    const [stories, setStories] = useState<any[]>([]);
    const navigate = useNavigate();

    const isAdmin = localStorage.getItem("isAdmin") === "true";

    /* ================= GUARD ================= */
    useEffect(() => {
        if (!isAdmin) {
            navigate("/home");
        }
    }, []);

    /* ================= FETCH ================= */
    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const data = await getStories();
            setStories(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    /* ================= DELETE ================= */
    const handleDelete = async (id: string) => {
        const confirmDelete = confirm("Delete this story?");
        if (!confirmDelete) return;

        try {
            await deleteStory(id);
            setStories((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>

            {/* HEADER */}
            <h1>Admin Dashboard</h1>
            <p>Manage all stories and chapters</p>

            {/* ACTION */}
            <button
                className="primary"
                onClick={() => navigate("/new")}
            >
                + Create New Story
            </button>

            <br /><br />

            {/* LIST */}
            {stories.length === 0 ? (
                <p>No stories yet.</p>
            ) : (
                <div className="story-list">
                    {stories.map((story) => (
                        <div key={story.id} className="story-card">

                            <h2>{story.title}</h2>

                            <p className="meta">
                                {story.type}
                            </p>

                            {/* ACTIONS */}
                            <div style={{ display: "flex", gap: "10px" }}>

                                <button
                                    className="read-btn"
                                    onClick={() => navigate(`/story/${story.id}`)}
                                >
                                    View
                                </button>

                                <button
                                    className="primary"
                                    onClick={() => navigate(`/new?edit=${story.id}`)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(story.id)}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}