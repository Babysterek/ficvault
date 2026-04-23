import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

type Bookmark = {
    id: string;
    story_id: string | null;
    stories?: {
        id: string;
        title: string;
        summary: string | null;
    } | null;
};

export default function Bookmarks() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        const role = localStorage.getItem("role");

        if (!role) {
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
          summary
        )
      `)
            .eq("user_id", role)
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

    if (loading) {
        return <div className="content">Loading bookmarks...</div>;
    }

    return (
        <div className="content" style={{ maxWidth: 900, margin: "auto" }}>
            <h1>My Bookmarks</h1>

            {bookmarks.length === 0 && <p>No bookmarks yet.</p>}

            {bookmarks.map((b) => (
                <div key={b.id} className="story-card">

                    <div
                        onClick={() => navigate(`/story/${b.story_id}`)}
                        style={{ cursor: "pointer" }}
                    >
                        <div className="meta">📖 Story</div>
                        <h3>{b.stories?.title || "Deleted story"}</h3>

                        {b.stories?.summary && (
                            <p className="excerpt">{b.stories.summary}</p>
                        )}
                    </div>

                    <button
                        className="delete"
                        onClick={() => removeBookmark(b.id)}
                    >
                        ✕
                    </button>

                </div>
            ))}
        </div>
    );
}