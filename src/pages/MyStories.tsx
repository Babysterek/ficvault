import { useEffect, useState } from "react";
import StoryCard from "../components/StoryCard";
import { getStories } from "../api";
import "./MyStories.css";

export default function MyStories() {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const profileId = localStorage.getItem("profile_id");

    useEffect(() => {
        fetchMyStories();
    }, []);

    const fetchMyStories = async () => {
        try {
            const data = await getStories();

            // 🔥 FILTER ONLY USER STORIES
            const myStories = (data || []).filter(
                (s: any) => s.user_id === profileId
            );

            setStories(myStories);
        } catch (err) {
            console.error(err);
            setStories([]);
        }

        setLoading(false);
    };

    return (
        <div className="my-stories">

            {/* HEADER */}
            <div className="ms-header">
                <h1>My Stories</h1>
                <p>Your published works</p>
            </div>

            {/* CONTENT */}
            {loading ? (
                <p className="empty">Loading...</p>
            ) : stories.length === 0 ? (
                <p className="empty">You haven’t posted any stories yet.</p>
            ) : (
                <div className="story-list">
                    {stories.map((story) => (
                        <StoryCard key={story.id} story={story} />
                    ))}
                </div>
            )}

        </div>
    );
}