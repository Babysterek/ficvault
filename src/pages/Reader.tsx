import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getStoryById,
    getChapters,
    addBookmark,
    removeBookmark,
    getBookmarks,
} from "../api";
import "./Reader.css";

export default function Reader() {
    const { id } = useParams();

    const [story, setStory] = useState<any>(null);
    const [chapters, setChapters] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);

    const profileId = localStorage.getItem("profile_id");

    /* ================= FETCH ================= */
    useEffect(() => {
        if (!id) return;
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const storyData = await getStoryById(id!);
            const chapterData = await getChapters(id!);

            setStory(storyData);
            setChapters(chapterData || []);

            // check bookmark
            if (profileId) {
                const bookmarks = await getBookmarks(profileId);
                const found = bookmarks?.find((b: any) => b.story_id === id);
                setIsBookmarked(!!found);
            }
        } catch (err) {
            console.error(err);
        }
    };

    /* ================= NAVIGATION ================= */
    const nextChapter = () => {
        if (currentIndex < chapters.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevChapter = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    /* ================= BOOKMARK ================= */
    const toggleBookmark = async () => {
        if (!profileId || !id) return;

        try {
            if (isBookmarked) {
                await removeBookmark(profileId, id);
                setIsBookmarked(false);
            } else {
                await addBookmark(profileId, id);
                setIsBookmarked(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    /* ================= UI ================= */

    if (!story) return <div className="reader-empty">Loading...</div>;
    if (chapters.length === 0)
        return <div className="reader-empty">No chapters yet.</div>;

    const currentChapter = chapters[currentIndex];

    return (
        <div className="reader-layout">

            {/* ===== LEFT SIDEBAR ===== */}
            <aside className="chapter-sidebar">
                {chapters.map((ch, i) => (
                    <div
                        key={ch.id}
                        className={`chapter-item ${i === currentIndex ? "active" : ""}`}
                        onClick={() => setCurrentIndex(i)}
                    >
                        Chapter {ch.chapter_number}
                    </div>
                ))}
            </aside>

            {/* ===== MAIN READER ===== */}
            <div className="reader-main">

                <div className="reader-card">

                    {/* HEADER */}
                    <h1>{story.title}</h1>

                    <div className="reader-meta">
                        <span>by {story.author || "Unknown"}</span>
                        <span>{story.type}</span>
                    </div>

                    <button className="primary" onClick={toggleBookmark}>
                        {isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                    </button>

                    {/* CHAPTER */}
                    <div className="chapter-header">
                        Chapter {currentChapter.chapter_number} / {chapters.length}
                    </div>

                    {/* CONTENT */}
                    <div
                        className="story-content"
                        dangerouslySetInnerHTML={{ __html: currentChapter.content }}
                    />

                    {/* NAVIGATION */}
                    <div className="reader-controls">
                        <button onClick={prevChapter} disabled={currentIndex === 0}>
                            ← Previous
                        </button>

                        <button
                            onClick={nextChapter}
                            disabled={currentIndex === chapters.length - 1}
                        >
                            Next →
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}