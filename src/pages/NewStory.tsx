import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStory, createChapter } from "../api";
import "./NewStory.css";

export default function NewStory() {
    const navigate = useNavigate();

    const profileId = localStorage.getItem("profile_id");

    /* ===== STORY STATE ===== */
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<"fanfiction" | "drabble">("fanfiction");

    /* ===== CHAPTER STATE ===== */
    const [chapters, setChapters] = useState([
        { chapter_number: 1, title: "", content: "" },
    ]);

    const [loading, setLoading] = useState(false);

    /* ===== ADD CHAPTER ===== */
    const addChapter = () => {
        setChapters((prev) => [
            ...prev,
            {
                chapter_number: prev.length + 1,
                title: "",
                content: "",
            },
        ]);
    };

    /* ===== UPDATE CHAPTER ===== */
    const updateChapter = (
        index: number,
        field: "title" | "content",
        value: string
    ) => {
        const updated = [...chapters];
        updated[index][field] = value;
        setChapters(updated);
    };

    /* ===== SAVE ===== */
    const handleSave = async () => {
        if (!title.trim()) {
            alert("Title is required");
            return;
        }

        setLoading(true);

        try {
            // 1️⃣ CREATE STORY
            const story = await createStory({
                title,
                description,
                type,
                user_id: profileId,
            });

            // 2️⃣ CREATE CHAPTERS
            for (const ch of chapters) {
                await createChapter({
                    story_id: story.id,
                    chapter_number: ch.chapter_number,
                    title: ch.title,
                    content: ch.content, // HTML supported
                });
            }

            navigate(`/story/${story.id}`);
        } catch (err) {
            console.error(err);
            alert("Failed to create story");
        }

        setLoading(false);
    };

    return (
        <div className="new-story">

            {/* HEADER */}
            <h1>Create New Story</h1>

            {/* STORY INFO */}
            <input
                className="input"
                placeholder="Story Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
                className="input"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <select
                className="input"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
            >
                <option value="fanfiction">Fanfiction</option>
                <option value="drabble">Drabble</option>
            </select>

            {/* CHAPTERS */}
            <h2>Chapters</h2>

            {chapters.map((ch, i) => (
                <div key={i} className="chapter-box">

                    <h3>Chapter {ch.chapter_number}</h3>

                    <input
                        className="input"
                        placeholder="Chapter Title"
                        value={ch.title}
                        onChange={(e) =>
                            updateChapter(i, "title", e.target.value)
                        }
                    />

                    <textarea
                        className="editor"
                        placeholder="Write HTML content here..."
                        value={ch.content}
                        onChange={(e) =>
                            updateChapter(i, "content", e.target.value)
                        }
                    />

                </div>
            ))}

            <button className="secondary" onClick={addChapter}>
                + Add Chapter
            </button>

            {/* SAVE */}
            <button
                className="primary"
                onClick={handleSave}
                disabled={loading}
            >
                {loading ? "Saving..." : "Publish Story"}
            </button>

        </div>
    );
}