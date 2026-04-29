import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
// @ts-ignore
import { Editor } from '@tinymce/tinymce-react';

export default function NewStory() {
    const navigate = useNavigate();
    const editorRef = useRef<any>(null);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState<'rich' | 'html'>('rich');

    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [skin, setSkin] = useState('');
    const [content, setContent] = useState('');

    const handlePost = async () => {
        const finalContent = editMode === 'rich' ? editorRef.current?.getContent() : content;
        if (!title || !finalContent) return alert("Title and Content are required!");

        setLoading(true);
        try {
            const { data: storyData, error: storyError } = await supabase
                .from('stories')
                .insert([{ title, summary, work_skin: skin, author: 'Babysterek' }])
                .select().single();

            if (storyError) throw storyError;

            await supabase.from('chapters').insert([{
                story_id: storyData.id,
                chapter_number: 1,
                content: finalContent,
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
                    <input placeholder="Work Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: '10px' }} />
                    <textarea placeholder="Work Skin (CSS)" value={skin} onChange={(e) => setSkin(e.target.value)} style={{ height: '60px', padding: '10px', fontFamily: 'monospace' }} />
                    <textarea placeholder="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} style={{ height: '60px', padding: '10px' }} />
                </div>

                {/* 🔄 RICH TEXT / HTML TOGGLE */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', marginTop: '20px' }}>
                    <button onClick={() => setEditMode('rich')} style={{ padding: '5px 15px', background: editMode === 'rich' ? '#3E2723' : '#ccc', color: editMode === 'rich' ? 'white' : 'black' }}>Rich Text</button>
                    <button onClick={() => setEditMode('html')} style={{ padding: '5px 15px', background: editMode === 'html' ? '#3E2723' : '#ccc', color: editMode === 'html' ? 'white' : 'black' }}>HTML</button>
                </div>

                <div style={{ margin: '10px 0', border: '1px solid #ccc' }}>
                    {editMode === 'rich' ? (
                        <Editor
                            apiKey="0dwpdw2m9932lqvdy75kj7fil1nrgcio3dk6ij0f74cemevw"
                            onInit={(_evt: any, editor: any) => editorRef.current = editor}
                            initialValue={content}
                            init={{
                                height: 500,
                                menubar: false,
                                plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'wordcount', 'hr', 'paste'],
                                toolbar: 'blocks fontfamily | paste | bold italic underline strikethrough | bullist numlist | alignleft aligncenter alignright | link image | blockquote hr | undo redo | code',
                                font_family_formats: 'Arial=arial,helvetica; Georgia=georgia,palatino; Times New Roman=times new roman,times; Courier New=courier new,courier;',
                                image_dimensions: true,
                            }}
                        />
                    ) : (
                        <textarea
                            style={{ width: '100%', height: '500px', padding: '10px', fontFamily: 'monospace', fontSize: '1rem' }}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    )}
                </div>

                <button onClick={handlePost} disabled={loading} style={{ background: '#3E2723', color: 'white', padding: '15px 40px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                    {loading ? "POSTING..." : "POST TO VAULT"}
                </button>
            </div>
        </div>
    );
}
