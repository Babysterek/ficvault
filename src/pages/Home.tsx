import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import StoryCard from "../components/StoryCard";
import "./Home.css";

export default function Home() {
    const [stories, setStories] = useState<any[]>([]);
    const [filter, setFilter] = useState<"all" | "fanfiction" | "drabble">("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("stories")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            setStories([]);
        } else {
            setStories(data || []);
        }

        setLoading(false);
    };

    /* ===== FILTER ===== */
    const filteredStories = stories.filter((s) => {
        if (filter === "fanfiction") return s.type === "fanfiction";
        if (filter === "drabble") return s.type === "drabble";
        return true;
    });

    return (
        <div className="home">

            {/* HEADER */}
            <div className="home-header">
                <h1>Explore Stories</h1>
                <p>Curated fanfictions & drabbles — read and get lost.</p>
            </div>

            {/* FILTER */}
            <div className="home-filters">
                <button
                    className={filter === "all" ? "active" : ""}
                    onClick={() => setFilter("all")}
                >
                    All
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

            {/* CONTENT */}
            {loading ? (
                <div className="empty">Loading...</div>
            ) : filteredStories.length === 0 ? (
                <div className="empty">No stories yet.</div>
            ) : (
                <div className="story-list">
                    {filteredStories.map((story) => (
                        <StoryCard key={story.id} story={story} />
                    ))}
                </div>
            )}

        </div>
    );
}