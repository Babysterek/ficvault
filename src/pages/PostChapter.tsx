import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
// @ts-ignore
import { Editor } from '@tinymce/tinymce-react';

export default function PostChapter() {
    const editorRef = useRef<any>(null);
    const [stories, setStories] = useState<any[]>([]);
    const [selectedStory, setSelectedStory] = useState('');
    const [title, setTitle] = useState('');
    const [num, setNum] = useState(1);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState<'rich' | 'html'>('rich');
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        const fetchStories = async () => {
            const { data } = await supabase.from('stories').select('id, title');
            if (data) setStories(data);
        };
        fetchStories();
    }, []);

    const handleSave = async () => {
        const content = editMode === 'rich' ? editorRef.current?.getContent() : htmlContent;

        if (!selectedStory || !content) return alert("Select work and write content!");

        setLoading(true);
        try {
            const { error } = await supabase.from('chapters').insert([{
                story_id: selectedStory,
                chapter_number: num,
                title: title || `Chapter ${num}`,
                content: content
            }]);

            if (error) throw error;

            alert("✨ Chapter Published!");
            setHtmlContent('');
            setTitle('');
            setNum(prev => prev + 1);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '30px', maxWidth: '1000px', margin: 'auto', border: '1px solid #3E2723', boxShadow: '10px 10px 0px #3E2723' }}>
                <h2 style={{ fontFamily: 'serif', borderBottom: '2px solid #3E2723', paddingBottom: '10px' }}>ADD NEW CHAPTER</h2>

                <select onChange={(e) => setSelectedStory(e.target.value)} style={{ width: '100%', padding: '10px', margin: '15px 0', border: '1px solid #3E2723' }}>
                    <option value="">Pick a Story...</option>
                    {stories.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <input placeholder="Chapter Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ flex: 2, padding: '10px', border: '1px solid #3E2723' }} />
                    <input type="number" value={num} onChange={(e) => setNum(parseInt(e.target.value))} style={{ flex: 1, padding: '10px', border: '1px solid #3E2723' }} />
                </div>

                {/* 🔄 MODE TOGGLE */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', marginBottom: '10px' }}>
                    <button onClick={() => setEditMode('rich')} style={{ padding: '5px 15px', background: editMode === 'rich' ? '#3E2723' : '#eee', color: editMode === 'rich' ? 'white' : 'black', border: 'none', cursor: 'pointer' }}>Rich Text</button>
                    <button onClick={() => setEditMode('html')} style={{ padding: '5px 15px', background: editMode === 'html' ? '#3E2723' : '#eee', color: editMode === 'html' ? 'white' : 'black', border: 'none', cursor: 'pointer' }}>HTML</button>
                </div>

                <div style={{ border: '1px solid #ccc' }}>
                    {editMode === 'rich' ? (
                        <Editor
                            apiKey="0dwpdw2m9932lqvdy75kj7fil1nrgcio3dk6ij0f74cemevw"
                            onInit={(evt: any, editor: any) => editorRef.current = editor}
                            initialValue={htmlContent}
                            init={{
                                height: 500,
                                menubar: false,
                                plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'wordcount', 'hr', 'paste'],
                                // 🌟 ADDED 'blocks' FOR HEADLINES
                                toolbar: 'blocks | paste | bold italic underline strikethrough | bullist numlist | alignleft aligncenter alignright alignjustify | link unlink image | blockquote hr | undo redo | code',
                                image_dimensions: true,
                                image_title: true
                            }}
                        />
                    ) : (
                        <textarea
                            style={{ width: '100%', height: '500px', padding: '10px', fontFamily: 'monospace', border: 'none', boxSizing: 'border-box' }}
                            value={htmlContent}
                            onChange={(e) => setHtmlContent(e.target.value)}
                        />
                    )}
                </div>

                <button onClick={handleSave} disabled={loading} style={{ width: '100%', background: '#3E2723', color: 'white', padding: '15px', marginTop: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                    {loading ? "PUBLISHING..." : "PUBLISH CHAPTER"}
                </button>
            </div>
        </div>
    );
}
