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

    const handlePost = async () => {
        // Gets the text/HTML from the editor
        const content = editorRef.current ? editorRef.current.getContent() : '';

        if (!title || !fandoms || !content) {
            return alert("Title, Fandom, and Content are required!");
        }

        setLoading(true);
        try {
            const { data: storyData, error: storyError } = await supabase
                .from('stories')
                .insert([{
                    title, fandoms, summary, author: 'Babysterek'
                }])
                .select().single();

            if (storyError) throw storyError;

            const { error: chapError } = await supabase
                .from('chapters')
                .insert([{
                    story_id: storyData.id,
                    chapter_number: 1,
                    content: content,
                    title: 'Chapter 1'
                }]);

            if (chapError) throw chapError;

            alert("✨ Success!");
            navigate('/archive');
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#eee', minHeight: '100vh', padding: '20px', textAlign: 'left', color: '#000' }}>
            <div style={{ maxWidth: '1000px', margin: 'auto', background: 'white', border: '1px solid #ccc', padding: '20px' }}>
                <h2 style={{ background: '#3E2723', color: 'white', padding: '10px', margin: '-20px -20px 20px -20px' }}>FICVAULT: POST NEW WORK</h2>

                <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
                    <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: '10px' }} />
                    <input placeholder="Fandoms" value={fandoms} onChange={(e) => setFandoms(e.target.value)} style={{ padding: '10px' }} />
                    <textarea placeholder="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} style={{ height: '60px', padding: '10px' }} />
                </div>

                <div style={{ margin: '20px 0', border: '1px solid #ccc' }}>
                    <Editor
                        onInit={(evt: any, editor: any) => editorRef.current = editor}
                        init={{
                            height: 500,
                            menubar: true,
                            plugins: ['link', 'image', 'lists', 'code', 'help', 'wordcount'],
                            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | image link | code',
                        }}
                    />
                </div>

                <button
                    onClick={handlePost}
                    disabled={loading}
                    style={{ background: '#3E2723', color: 'white', padding: '15px 40px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                >
                    {loading ? "ARCHIVING..." : "POST TO VAULT"}
                </button>
            </div>
        </div>
    );
}
