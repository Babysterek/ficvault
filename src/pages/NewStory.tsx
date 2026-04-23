import { useState, useRef } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function NewStory({ user }: any) {
    const navigate = useNavigate();

    /* ================= STATE ================= */
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");

    const [status, setStatus] = useState("ongoing");
    const [isAnon, setIsAnon] = useState(false); // ✅ NEW

    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    /* IMAGE MODAL */
    const [showImageModal, setShowImageModal] = useState(false);
    const [imgUrl, setImgUrl] = useState("");
    const [imgWidth, setImgWidth] = useState("");
    const [imgHeight, setImgHeight] = useState("");

    if (!user) {
        return <div style={{ padding: 40 }}>Please login</div>;
    }

    /* ================= EDITOR ================= */

    const insertAtCursor = (text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const newText =
            content.substring(0, start) +
            text +
            content.substring(end);

        setContent(newText);

        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + text.length;
            textarea.focus();
        }, 0);
    };

    const wrapSelection = (open: string, close: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const selected = content.substring(start, end);

        const newText =
            content.substring(0, start) +
            open +
            selected +
            close +
            content.substring(end);

        setContent(newText);
    };

    /* ================= IMAGE UPLOAD ================= */

    const uploadImage = async (file: File) => {
        const fileName = `${Date.now()}-${file.name}`;

        const { error } = await supabase.storage
            .from("story-images")
            .upload(fileName, file);

        if (error) {
            alert("Upload failed");
            return null;
        }

        const { data } = supabase.storage
            .from("story-images")
            .getPublicUrl(fileName);

        return data.publicUrl;
    };

    /* ================= SAVE ================= */

    const saveStory = async () => {
        if (!title.trim()) return alert("Title required");
        if (!content.trim()) return alert("Content required");

        setLoading(true);

        try {
            const { data: story, error } = await supabase
                .from("stories")
                .insert([
                    {
                        title,
                        summary,
                        is_completed: status === "finished",
                        user_id: isAnon ? null : user.id, // ✅ ANON SUPPORT
                    },
                ])
                .select()
                .single();

            if (error || !story) {
                alert(error?.message);
                return;
            }

            await supabase.from("chapters").insert([
                {
                    story_id: story.id,
                    title: "Chapter 1",
                    content,
                    chapter_no: 1,
                },
            ]);

            alert("Story posted!");
            navigate("/");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="new-story">

            {/* HEADER */}
            <div className="header">
                <h1>New Story</h1>

                <button onClick={() => setPreview(!preview)}>
                    {preview ? "Edit" : "Preview"}
                </button>
            </div>

            {/* META */}
            <div className="meta">
                <span>Chapter: 1/?</span>

                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="ongoing">Ongoing</option>
                    <option value="finished">Finished</option>
                </select>

                {/* ✅ ANON TOGGLE */}
                <label className="anon-toggle">
                    <input
                        type="checkbox"
                        checked={isAnon}
                        onChange={() => setIsAnon(!isAnon)}
                    />
                    Post Anonymously
                </label>
            </div>

            {/* TITLE */}
            <input
                className="input"
                placeholder="Story Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            {/* SUMMARY */}
            <textarea
                className="input"
                placeholder="Summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
            />

            {/* TOOLBAR */}
            {!preview && (
                <div className="toolbar">

                    <button onClick={() => wrapSelection("<b>", "</b>")}>B</button>
                    <button onClick={() => wrapSelection("<i>", "</i>")}>I</button>

                    <button onClick={() =>
                        insertAtCursor('\n<hr class="scene-break" />\n')
                    }>
                        Divider
                    </button>

                    <button onClick={() =>
                        wrapSelection('<p style="text-align:center;">', "</p>")
                    }>
                        Center
                    </button>

                    <button onClick={() => setShowImageModal(true)}>
                        Image
                    </button>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const url = await uploadImage(file);
                            if (url) insertAtCursor(`<img src="${url}" />`);
                        }}
                    />
                </div>
            )}

            {/* EDITOR */}
            {preview ? (
                <div
                    className="preview"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            ) : (
                <textarea
                    ref={textareaRef}
                    className="editor"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            )}

            {/* POST */}
            <button
                className="primary"
                onClick={saveStory}
                disabled={loading}
            >
                {loading ? "Posting..." : "Post Story"}
            </button>

            {/* IMAGE MODAL */}
            {showImageModal && (
                <div className="modal-overlay">
                    <div className="modal">

                        <h3>Insert Image</h3>

                        <input
                            placeholder="Image URL"
                            value={imgUrl}
                            onChange={(e) => setImgUrl(e.target.value)}
                        />

                        <div className="row">
                            <input
                                placeholder="Width"
                                value={imgWidth}
                                onChange={(e) => setImgWidth(e.target.value)}
                            />
                            <input
                                placeholder="Height"
                                value={imgHeight}
                                onChange={(e) => setImgHeight(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={() => {
                                if (!imgUrl) return;

                                let style = "";
                                if (imgWidth) style += `width:${imgWidth}px;`;
                                if (imgHeight) style += `height:${imgHeight}px;`;

                                insertAtCursor(`<img src="${imgUrl}" style="${style}" />`);

                                setShowImageModal(false);
                                setImgUrl("");
                                setImgWidth("");
                                setImgHeight("");
                            }}
                        >
                            Insert
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
}