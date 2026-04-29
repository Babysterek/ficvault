import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
// @ts-ignore
import { Editor } from '@tinymce/tinymce-react';

export default function EditChapter() {
    const { id } = useParams();
    const navigate = useNavigate();
    const editorRef = useRef<any>(null);
    const [chapter, setChapter] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const { data } = await supabase.from('chapters').select('*, stories(title)').eq('id', id).single();
            if (data) setChapter(data);
            setLoading(false);
        };
        fetch();
    }, [id]);

    const handleUpdate = async () => {
        const content = editorRef.current?.getContent();
        await supabase.from('chapters').update({ content }).eq('id', id);
        alert("✨ Updated!");
        navigate('/manage-stories');
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Decrypting...</div>;

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '30px', maxWidth: '1000px', margin: 'auto', border: '1px solid #3E2723' }}>
                <h2 style={{ fontFamily: 'serif' }}>EDITING: {chapter?.stories?.title} - Ch {chapter?.chapter_number}</h2>
                <Editor
                    apiKey="0dwpdw2m9932lqvdy75kj7fil1nrgcio3dk6ij0f74cemevw"
                    onInit={(evt: any, editor: any) => editorRef.current = editor}
                    initialValue={chapter?.content}
                    init={{
                        height: 600, menubar: false,
                        plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'wordcount', 'hr', 'paste'],
                        toolbar: 'paste | bold italic underline strikethrough | bullist numlist | alignleft aligncenter alignright | link unlink image | blockquote hr | undo redo | code',
                        image_dimensions: true
                    }}
                />
                <button onClick={handleUpdate} style={{ background: '#3E2723', color: 'white', padding: '15px 40px', marginTop: '20px' }}>SAVE CHANGES</button>
            </div>
        </div>
    );
}
