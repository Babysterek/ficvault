import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
// @ts-ignore
import { Editor } from '@tinymce/tinymce-react';
import './NewStory.css';

export default function NewStory() {
    const navigate = useNavigate();
    const editorRef = useRef<any>(null);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState<'rich' | 'html'>('rich');

    // Form States
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [skin, setSkin] = useState('');
    const [content, setContent] = useState('');
    const [expected, setExpected] = useState('?');
    const [isComplete, setIsComplete] = useState(false);

    const handlePost = async (status: 'published' | 'draft') => {
        const finalContent = editMode === 'rich' ? editorRef.current?.getContent() : content;

        if (!title || !finalContent) {
            return alert("Title and Content are required!");
        }

        setLoading(true);
        try {
            const { data: storyData, error: storyError } = await supabase
                .from('stories')
                .insert([{
                    title,
                    summary,
                    work_skin: skin,
                    author: 'Babysterek',
                    status: status,
                    is_complete: isComplete,
                    expected_chapters: expected
                }])
                .select().single();

            if (storyError) throw storyError;

            await supabase.from('chapters').insert([{
                story_id: storyData.id,
                chapter_number: 1,
                content: finalContent,
                title: 'Chapter 1'
            }]);

            alert(status === 'draft' ? "✨ Saved to Drafts!" : "🚀 Published to Vault!");
            navigate('/archive');
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="new-story" style={{ padding: '20px', textAlign: 'left' }}>
            <h2 style={{ background: '#3E2723', color: 'white', padding: '15px', borderRadius: '8px 8px 0 0', margin: 0 }}>
                FICVAULT: POST NEW WORK
            </h2>

            <div className="chapter-box" style={{ borderRadius: '0 0 8px 8px' }}>
                {/* 📝 Metadata Section */}
                <input
                    className="input"
                    placeholder="Work Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div style={{ display: 'flex', gap: '20px', margin: '10px 0' }}>
                    <label style={{ cursor: 'pointer' }}>
                        <input type="checkbox" checked={isComplete} onChange={(e) => setIsComplete(e.target.checked)} />
                        <span style={{ marginLeft: '5px' }}>Mark Complete</span>
                    </label>
                    <label>
                        Expected Chaps:
                        <input
                            className="input"
                            style={{ width: '50px', marginLeft: '10px', display: 'inline' }}
                            value={expected}
                            onChange={(e) => setExpected(e.target.value)}
                        />
                    </label>
                </div>

                <textarea
                    className="input"
                    placeholder="Work Skin (CSS Coding)"
                    value={skin}
                    onChange={(e) => setSkin(e.target.value)}
                    style={{ height: '80px', fontFamily: 'monospace' }}
                />

                <textarea
                    className="input"
                    placeholder="Summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    style={{ height: '80px' }}
                />

                {/* 🔄 Mode Toggles */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', marginBottom: '10px' }}>
                    <button className="secondary" onClick={() => setEditMode('rich')} style={{ background: editMode === 'rich' ? '#3E2723' : '#eee', color: editMode === 'rich' ? 'white' : 'black' }}>Rich Text</button>
                    <button className="secondary" onClick={() => setEditMode('html')} style={{ background: editMode === 'html' ? '#3E2723' : '#eee', color: editMode === 'html' ? 'white' : 'black' }}>HTML</button>
                </div>

                {/* 🖋️ Editor Section */}
                {editMode === 'rich' ? (
                    <Editor
                        apiKey="0dwpdw2m9932lqvdy75kj7fil1nrgcio3dk6ij0f74cemevw"
                        onInit={(evt: any, editor: any) => editorRef.current = editor}
                        initialValue={content}
                        init={{
                            height: 500,
                            menubar: false,
                            plugins: ['link', 'image', 'lists', 'code', 'hr', 'paste', 'media'],
                            // 🌟 ADDED 'blocks' FOR H1/H2/H3 DROPDOWN
                            toolbar: 'blocks | paste | bold italic underline strikethrough | bullist numlist | alignleft aligncenter alignright alignjustify | link unlink image | blockquote hr | undo redo | code',
                            image_dimensions: true,
                            image_title: true
                        }}
                    />
                ) : (
                    <textarea
                        className="editor"
                        style={{ height: '500px' }}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                )}

                {/* 🚀 Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button className="secondary" onClick={() => handlePost('draft')} disabled={loading}>
                        SAVE AS DRAFT
                    </button>
                    <button className="primary" onClick={() => handlePost('published')} disabled={loading}>
                        {loading ? "POSTING..." : "POST TO VAULT"}
                    </button>
                </div>
            </div>
        </div>
    );
}
