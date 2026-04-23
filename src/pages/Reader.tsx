import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";
import { toggleBookmark } from "./toggleBookmark";

export default function Reader() {
    const { id } = useParams();

    const [story, setStory] = useState<any>(null);
    const [chapters, setChapters] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [loading, setLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);

    const profileId = localStorage.getItem("profile_id");

    /* ================= FETCH ================= */

    useEffect(() => {
        if (!id) return;
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);

        const { data: storyData } = await supabase
            .from("stories")
            .select("*")
            .eq("id", id)
            .single();

        const { data: chapterData } = await supabase
            .from("chapters")
            .select("*")
            .eq("story_id", id)
            .order("chapter_no", { ascending: true });

        if (profileId) {
            const { data: bookmark } = await supabase
                .from("bookmarks")
                .select("*")
                .eq("user_id", profileId)
                .eq("story_id", id)
                .maybeSingle();

            setIsBookmarked(!!bookmark);
        }

        if (storyData) setStory(storyData);
        if (chapterData) setChapters(chapterData);

        setLoading(false);
    };

    /* ================= BOOKMARK ================= */

    const handleBookmark = async () => {
        if (!profileId || !id) return;

        const result = await toggleBookmark({
            userId: profileId,
            storyId: id,
        });

        setIsBookmarked(result);
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

    /* ================= UI ================= */

    if (loading) return <p>Loading...</p>;
    if (!story) return <p>Story not found</p>;
    if (chapters.length === 0) return <p>No chapters yet.</p>;

    const currentChapter = chapters[currentIndex];

    return (
        <div className="reader">

            {/* HEADER */}
            <h1>{story.title}</h1>

            <div className="meta">
                by <strong>Babysterek</strong>
            </div>

            <div className="meta">
                {story.total_words || 0} words
            </div>

            <span
                className={`status ${story.is_completed ? "completed" : "ongoing"
                    }`}
            >
                {story.is_completed ? "Completed" : "Ongoing"}
            </span>

            {/* BOOKMARK */}
            <div style={{ marginTop: 10 }}>
                <button onClick={handleBookmark} className="primary">
                    {isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                </button>
            </div>

            <hr style={{ margin: "20px 0" }} />

            {/* CHAPTER TITLE */}
            <h3>
                Chapter {currentChapter.chapter_no} / {chapters.length}
            </h3>

            {/* CONTENT */}
            <div
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
    );
}