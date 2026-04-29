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
    const [expected, setExpected] = useState('?');
    const [isComplete, setIsComplete] = useState(false);

    const handlePost = async (status: 'published' | 'draft') => {
        const finalContent = editMode === 'rich' ? editorRef.current?.getContent() : content;
        if (!title || !finalContent) return alert("Title and Content are required!");

        setLoading(true);
        try {
            const { data: storyData, error: storyError } = await supabase
                .from('stories')
                .insert([{
                    title, summary, work_skin: skin, author: 'Babysterek',
                    status, is_complete: isComplete, expected_chapters: expected
                }])
                .select().single();

            if (storyError) throw storyError;

            await supabase.from('chapters').insert([{
                story_id: storyData.id, chapter_number: 1,
                content: finalContent, title: 'Chapter 1'
            }]);

            alert(status === 'draft' ? "✨ Saved to Drafts!" : "🚀 Published!");
            navigate('/archive');
        } catch (err: any) { alert(err.message); } finally { setLoading(false); }
    };

    return (
        <div style={{ background: '#eee', minHeight: '100vh', padding: '20px', textAlign: 'left', color: '#000' }}>
            <div style={{ maxWidth: '1000px', margin: 'auto', background: 'white', border: '1px solid #3E2723', padding: '20px' }}>
                <h2 style={{ background: '#3E2723', color: 'white', padding: '10px' }}>POST NEW WORK</h2>

                <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
                    <input placeholder="Work Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: '10px', border: '1px solid #3E2723' }} />
                    <div style={{ display: 'flex', gap: '20px', background: '#f9f9f9', padding: '15px', border: '1px solid #ccc' }}>
                        <label><input type="checkbox" checked={isComplete} onChange={(e) => setIsComplete(e.target.checked)} /> <strong>Complete</strong></label>
                        <label><strong>Expected Chaps:</strong> <input value={expected} onChange={(e) => setExpected(e.target.value)} style={{ width: '40px' }} /></label>
                    </div>
                    <textarea placeholder="Work Skin (CSS)" value={skin} onChange={(e) => setSkin(e.target.value)} style={{ height: '60px', fontFamily: 'monospace' }} />
                    <textarea placeholder="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} style={{ height: '60px' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', marginTop: '20px' }}>
                    <button onClick={() => setEditMode('rich')} style={{ padding: '5px 15px', background: editMode === 'rich' ? '#3E2723' : '#ccc', color: editMode === 'rich' ? 'white' : 'black' }}>Rich Text</button>
                    <button onClick={() => setEditMode('html')} style={{ padding: '5px 15px', background: editMode === 'html' ? '#3E2723' : '#ccc', color: editMode === 'html' ? 'white' : 'black' }}>HTML</button>
                </div>

                <div style={{ margin: '10px 0', border: '1px solid #ccc' }}>
                    {editMode === 'rich' ? (
                        <Editor
                            apiKey="0dwpdw2m9932lqvdy75kj7fil1nrgcio3dk6ij0f74cemevw"
                            onInit={(evt: any, editor: any) => editorRef.current = editor}
                            initialValue={content}
                            init={{
                                height: 500, menubar: false,
                                plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'wordcount', 'hr', 'paste'],
                                toolbar: 'paste | bold italic underline strikethrough | blocks fontfamily | bullist numlist | alignleft aligncenter alignright alignjustify | link unlink image | blockquote hr | undo redo | code',
                                image_dimensions: true, image_title: true
                            }}
                        />
                    ) : (
                        <textarea style={{ width: '100%', height: '500px', fontFamily: 'monospace' }} value={content} onChange={(e) => setContent(e.target.value)} />
                    )}
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => handlePost('draft')} disabled={loading}>SAVE DRAFT</button>
                    <button onClick={() => handlePost('published')} disabled={loading} style={{ background: '#3E2723', color: 'white', padding: '10px 30px' }}>POST TO VAULT</button>
                </div>
            </div>
        </div>
    );
}
