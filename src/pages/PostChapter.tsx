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
        if (!selectedStory || !content) return alert("Select a work and write content!");

        setLoading(true);
        const { error } = await supabase.from('chapters').insert([{
            story_id: selectedStory,
            chapter_number: num,
            title: title || `Chapter ${num}`,
            content: content
        }]);

        setLoading(false);
        if (error) alert(error.message);
        else {
            alert("✨ Chapter Published!");
            setTitle('');
            setNum(prev => prev + 1);
        }
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '30px', maxWidth: '1000px', margin: 'auto', textAlign: 'left', border: '1px solid #3E2723', boxShadow: '10px 10px 0px #3E2723' }}>
                <h2 style={{ fontFamily: 'serif', borderBottom: '2px solid #3E2723', paddingBottom: '10px' }}>POST NEW CHAPTER</h2>

                <div style={{ margin: '20px 0' }}>
                    <label style={{ fontWeight: 'bold' }}>SELECT WORK</label>
                    <select onChange={(e) => setSelectedStory(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px' }}>
                        <option value="">Choose from your works...</option>
                        {stories.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 2 }}>
                        <label style={{ fontWeight: 'bold' }}>CHAPTER TITLE</label>
                        <input placeholder="Chapter Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontWeight: 'bold' }}>CHAPTER #</label>
                        <input type="number" value={num} onChange={(e) => setNum(parseInt(e.target.value))} style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                    </div>
                </div>

                <div style={{ border: '1px solid #ccc' }}>
                    <Editor
                        apiKey="0dwpdw2m9932lqvdy75kj7fil1nrgcio3dk6ij0f74cemevw"
                        onInit={(_evt: any, editor: any) => editorRef.current = editor}
                        init={{
                            height: 500,
                            menubar: true,
                            plugins: ['link', 'image', 'lists', 'code', 'help', 'wordcount', 'media'],
                            toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | image link media | code',
                            image_dimensions: true,
                            image_title: true,
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                    />
                </div>

                <button onClick={handleSave} disabled={loading} style={{ width: '100%', background: '#3E2723', color: 'white', padding: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px', border: 'none' }}>
                    {loading ? 'PUBLISHING...' : 'POST CHAPTER'}
                </button>
            </div>
        </div>
    );
}
