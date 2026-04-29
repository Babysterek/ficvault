import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
// @ts-ignore
import { Editor } from '@tinymce/tinymce-react';

export default function EditChapter() {
    const { id } = useParams(); // Chapter ID
    const navigate = useNavigate();
    const editorRef = useRef<any>(null);
    const [chapter, setChapter] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChapter = async () => {
            const { data } = await supabase.from('chapters').select('*, stories(title)').eq('id', id).single();
            if (data) setChapter(data);
            setLoading(false);
        };
        fetchChapter();
    }, [id]);

    const handleUpdate = async () => {
        const newContent = editorRef.current ? editorRef.current.getContent() : '';
        const { error } = await supabase.from('chapters').update({ content: newContent }).eq('id', id);

        if (error) alert(error.message);
        else {
            alert("✨ Chapter Updated!");
            navigate('/manage-stories');
        }
    };

    if (loading) return <div style={{ padding: '50px' }}>Loading Chapter Data...</div>;

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '30px', maxWidth: '1000px', margin: 'auto', textAlign: 'left', border: '1px solid #3E2723' }}>
                <h2>EDITING: {chapter?.stories?.title} - Chapter {chapter?.chapter_number}</h2>

                <div style={{ marginTop: '20px', border: '1px solid #ccc' }}>
                    <Editor
                        apiKey="0dwpdw2m9932lqvdy75kj7fil1nrgcio3dk6ij0f74cemevw"
                        onInit={(_evt: any, editor: any) => editorRef.current = editor}
                        initialValue={chapter?.content}
                        init={{
                            height: 600,
                            menubar: false,
                            plugins: ['link', 'image', 'lists', 'code', 'hr', 'paste', 'media'],
                            toolbar: 'undo redo | blocks fontfamily | bold italic underline | bullist numlist | link image media | code',
                            image_dimensions: true,
                            // 🌟 MAGIC FIX: This helps TinyMCE "see" image links
                            paste_data_images: true,
                            smart_paste: true
                        }}
                    />
                </div>

                <button onClick={handleUpdate} style={{ marginTop: '20px', padding: '15px 40px', background: '#3E2723', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    SAVE CHANGES
                </button>
            </div>
        </div>
    );
}
