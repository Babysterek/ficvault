import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
// @ts-ignore
import { Editor } from '@tinymce/tinymce-react';

export default function NewStory() {
    const navigate = useNavigate();
    const editorRef = useRef<any>(null);
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [fandoms, setFandoms] = useState('');
    const [summary, setSummary] = useState('');
    const [skin, setSkin] = useState(''); // 🎨 Work Skin State

    const handlePost = async () => {
        const content = editorRef.current ? editorRef.current.getContent() : '';
        if (!title || !content) return alert("Title and Content are required!");

        setLoading(true);
        try {
            const { data: storyData, error: storyError } = await supabase
                .from('stories')
                .insert([{
                    title,
                    fandoms,
                    summary,
                    work_skin: skin, // Saves the CSS skin
                    author: 'Babysterek'
                }])
                .select().single();

            if (storyError) throw storyError;

            await supabase.from('chapters').insert([{
                story_id: storyData.id,
                chapter_number: 1,
                content: content,
                title: 'Chapter 1'
            }]);

            navigate('/archive');
        } catch (err: any) { alert(err.message); } finally { setLoading(false); }
    };

    return (
        <div style={{ background: '#eee', minHeight: '100vh', padding: '20px', textAlign: 'left', color: '#000' }}>
            <div style={{ maxWidth: '1000px', margin: 'auto', background: 'white', border: '1px solid #ccc', padding: '20px' }}>
                <h2 style={{ background: '#3E2723', color: 'white', padding: '10px', margin: '-20px -20px 20px -20px' }}>FICVAULT: POST NEW WORK</h2>

                <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
                    <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: '10px' }} />

                    {/* 🎨 WORK SKIN BOX */}
                    <div style={{ background: '#f9f9f9', padding: '10px', border: '1px solid #ccc' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>WORK SKIN (CSS)</label>
                        <textarea
                            placeholder="Paste custom CSS here (e.g. .message { color: blue; })"
                            value={skin}
                            onChange={(e) => setSkin(e.target.value)}
                            style={{ width: '100%', height: '80px', fontFamily: 'monospace', marginTop: '5px' }}
                        />
                    </div>

                    <textarea placeholder="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} style={{ height: '60px', padding: '10px' }} />
                </div>

                <div style={{ margin: '20px 0', border: '1px solid #ccc' }}>
                    <Editor
                        apiKey="0dwpdw2m9932lqvdy75kj7fil1nrgcio3dk6ij0f74cemevw"
                        onInit={(_evt: any, editor: any) => editorRef.current = editor}
                        init={{
                            height: 500,
                            menubar: false,
                            plugins: ['link', 'image', 'lists', 'code', 'hr', 'paste', 'wordcount'],
                            // 🌟 MATCHES AO3 TOOLBAR IMAGE EXACTLY
                            toolbar: 'paste | bold italic underline strikethrough | link unlink image | blockquote hr | undo redo | code',
                            image_dimensions: true,
                            image_title: true,
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                    />
                </div>

                <button onClick={handlePost} disabled={loading} style={{ background: '#3E2723', color: 'white', padding: '15px 40px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                    {loading ? "ARCHIVING..." : "POST TO VAULT"}
                </button>
            </div>
        </div>
    );
}
