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

    useEffect(() => {
        const fetchStories = async () => {
            const { data } = await supabase.from('stories').select('id, title');
            if (data) setStories(data);
        };
        fetchStories();
    }, []);

    const handleSave = async () => {
        const content = editorRef.current ? editorRef.current.getContent() : '';
        if (!selectedStory || !content) return alert("Select work and write content!");

        setLoading(true);
        await supabase.from('chapters').insert([{
            story_id: selectedStory, chapter_number: num,
            title: title || `Chapter ${num}`, content: content
        }]);
        alert("✨ Chapter Published!");
        setNum(prev => prev + 1);
        setLoading(false);
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '30px', maxWidth: '1000px', margin: 'auto', border: '1px solid #3E2723' }}>
                <h2 style={{ fontFamily: 'serif' }}>ADD NEW CHAPTER</h2>
                <select onChange={(e) => setSelectedStory(e.target.value)} style={{ width: '100%', padding: '10px', margin: '15px 0' }}>
                    <option value="">Pick a Story...</option>
                    {stories.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <input placeholder="Chapter Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ flex: 2, padding: '10px' }} />
                    <input type="number" value={num} onChange={(e) => setNum(parseInt(e.target.value))} style={{ flex: 1, padding: '10px' }} />
                </div>
                <Editor
                    apiKey="0dwpdw2m9932lqvdy75kj7fil1nrgcio3dk6ij0f74cemevw"
                    onInit={(evt: any, editor: any) => editorRef.current = editor}
                    init={{
                        height: 500, menubar: false,
                        plugins: ['link', 'image', 'lists', 'code', 'hr', 'paste'],
                        toolbar: 'paste | bold italic underline strikethrough | bullist numlist | alignleft aligncenter alignright | link unlink image | blockquote hr | undo redo | code',
                        image_dimensions: true
                    }}
                />
                <button onClick={handleSave} disabled={loading} style={{ width: '100%', background: '#3E2723', color: 'white', padding: '15px', marginTop: '20px' }}>PUBLISH CHAPTER</button>
            </div>
        </div>
    );
}
