import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import "./Home.css";

type Bookmark = {
    id: string;
    story_id: string | null;
    stories?: {
        id: string;
        title: string;
        description: string | null;
    } | null;
};

export default function Bookmarks() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const profileId = localStorage.getItem("profile_id");

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        if (!profileId) {
            setBookmarks([]);
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("bookmarks")
            .select(`
                id,
                story_id,
                stories (
                    id,
                    title,
                    description
                )
            `)
            .eq("user_id", profileId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            setBookmarks([]);
        } else {
            setBookmarks((data || []) as any);
        }

        setLoading(false);
    };

    const removeBookmark = async (id: string) => {
        await supabase.from("bookmarks").delete().eq("id", id);
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
    };

    return (
        <div className="home-wrapper">

            <div className="home-header">
                <h1>My Bookmarks</h1>
            </div>

            {/* LOADING */}
            {loading ? (
                <div className="empty-state">Loading bookmarks...</div>
            ) : bookmarks.length === 0 ? (
                <div className="empty-state">No bookmarks yet.</div>
            ) : (
                <div className="story-grid">
                    {bookmarks.map((b) => (
                        <div key={b.id} className="story-card">

                            {/* CLICKABLE */}
                            <div
                                onClick={() => navigate(`/story/${b.story_id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <h3>{b.stories?.title || "Deleted story"}</h3>

                                <p>
                                    {b.stories?.description || "No description"}
                                </p>
                            </div>

                            {/* REMOVE */}
                            <button
                                className="delete-btn"
                                onClick={() => removeBookmark(b.id)}
                            >
                                Remove
                            </button>

                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}