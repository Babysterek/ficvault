import { useNavigate } from "react-router-dom";

type Story = {
    id: string;
    title: string;
    description?: string;
    author?: string;
    type?: "fanfiction" | "drabble";
};

export default function StoryCard({ story }: { story: Story }) {
    const navigate = useNavigate();

    return (
        <div className="story-card">

            {/* TITLE */}
            <h2
                className="story-title"
                onClick={() => navigate(`/story/${story.id}`)}
            >
                {story.title}
            </h2>

            {/* META */}
            <div className="story-meta">
                <span>by {story.author || "Unknown"}</span>
                <span>•</span>
                <span>
                    {story.type === "drabble" ? "Drabble" : "Fanfiction"}
                </span>
            </div>

            {/* DESCRIPTION */}
            <p className="story-desc">
                {story.description || "No description available."}
            </p>

            {/* ACTION */}
            <button
                className="read-btn"
                onClick={() => navigate(`/story/${story.id}`)}
            >
                Read →
            </button>

        </div>
    );
}