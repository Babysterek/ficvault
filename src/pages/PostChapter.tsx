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
    const [editMode, setEditMode] = useState<'rich' | 'html'>('rich');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStories = async () => {
            const { data } = await supabase.from('stories').select('id, title');
            if (data) setStories(data);
        };
        fetchStories();
    }, []);

    const handleSave = async () => {
        const finalContent = editMode === 'rich' ? editorRef.current?.getContent() : content;
        if (!selectedStory || !finalContent) return alert("Select a work and write content!");

        setLoading(true);
        const { error } = await supabase.from('chapters').insert([{
            story_id: selectedStory,
            chapter_number: num,
            title: title || `Chapter ${num}`,
            content: finalContent
        }]);

        setLoading(false);
        if (error) alert(error.message);
        else {
            alert("✨ Chapter Published!");
            setContent('');
            setTitle('');
            setNum(prev => prev + 1);
        }
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '30px', maxWidth: '1000px', margin: 'auto', textAlign: 'left', border: '1px solid #3E2723' }}>
                <h2 style={{ fontFamily: 'serif', borderBottom: '2px solid #3E2723', paddingBottom: '10px' }}>POST NEW CHAPTER</h2>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <select onChange={(e) => setSelectedStory(e.target.value)} style={{ flex: 2, padding: '10px' }}>
                        <option value="">Pick a Story...</option>
                        {stories.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                    <input type="number" value={num} onChange={(e) => setNum(parseInt(e.target.value))} style={{ flex: 1, padding: '10px' }} />
                </div>

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

                <button onClick={handleSave} disabled={loading} style={{ width: '100%', background: '#3E2723', color: 'white', padding: '15px', fontWeight: 'bold', border: 'none' }}>
                    {loading ? 'PUBLISHING...' : 'POST CHAPTER'}
                </button>
            </div>
        </div>
    );
}
