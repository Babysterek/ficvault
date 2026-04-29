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
    const [skin, setSkin] = useState('');
    const [summary, setSummary] = useState('');

    const handlePost = async (status: 'published' | 'draft') => {
        const content = editorRef.current?.getContent();
        if (!title || !content) return alert("Title and Content required!");
        setLoading(true);
        const { data: storyData } = await supabase.from('stories').insert([{
            title, summary, work_skin: skin, author: 'Babysterek', status
        }]).select().single();

        if (storyData) {
            await supabase.from('chapters').insert([{ story_id: storyData.id, chapter_number: 1, content, title: 'Chapter 1' }]);
            navigate('/archive');
        }
        setLoading(false);
    };

    return (
        <div style={{ background: '#eee', padding: '20px', textAlign: 'left' }}>
            <div style={{ maxWidth: '1000px', margin: 'auto', background: 'white', border: '1px solid #3E2723', padding: '20px' }}>
                <h2 style={{ background: '#3E2723', color: 'white', padding: '10px' }}>POST NEW WORK</h2>
                <input placeholder="Story Title" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px' }} />
                <textarea placeholder="Work Skin (CSS)" value={skin} onChange={e => setSkin(e.target.value)} style={{ width: '100%', height: '80px', marginBottom: '15px' }} />
                <Editor
                    apiKey="0dwpdw2m9932lqvdy75kj7fil1nrgcio3dk6ij0f74cemevw"
                    onInit={(_evt: any, editor: any) => editorRef.current = editor}
                    init={{
                        height: 500,
                        plugins: ['link', 'image', 'lists', 'code', 'hr', 'paste'],
                        toolbar: 'blocks fontfamily | paste | bold italic underline strikethrough | bullist numlist | alignleft aligncenter alignright | link image | blockquote hr | undo redo | code',
                        image_dimensions: true,
                    }}
                />
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => handlePost('draft')} style={{ padding: '10px 20px' }}>SAVE DRAFT</button>
                    <button onClick={() => handlePost('published')} style={{ padding: '10px 30px', background: '#3E2723', color: 'white', border: 'none' }}>PUBLISH</button>
                </div>
            </div>
        </div>
    );
}
