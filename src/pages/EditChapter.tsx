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

    useEffect(() => {
        const fetch = async () => {
            const { data } = await supabase.from('chapters').select('*, stories(title)').eq('id', id).single();
            if (data) setChapter(data);
        };
        fetch();
    }, [id]);

    const save = async () => {
        const content = editorRef.current?.getContent();
        await supabase.from('chapters').update({ content }).eq('id', id);
        alert("Saved!");
        navigate('/manage-stories');
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '30px', maxWidth: '1000px', margin: 'auto', border: '2px solid #3E2723' }}>
                <h2>EDITING: {chapter?.stories?.title} - Ch {chapter?.chapter_number}</h2>
                <Editor
                    apiKey="0dwpdw2m9932lqvdy75kj7fil1nrgcio3dk6ij0f74cemevw"
                    onInit={(_evt: any, editor: any) => editorRef.current = editor}
                    initialValue={chapter?.content}
                    init={{
                        height: 500,
                        plugins: ['link', 'image', 'lists', 'code', 'hr', 'paste'],
                        toolbar: 'blocks fontfamily | bold italic underline | link image | code',
                        image_dimensions: true,
                    }}
                />
                <button onClick={save} style={{ marginTop: '20px', background: '#3E2723', color: 'white', padding: '10px 30px', border: 'none', cursor: 'pointer' }}>SAVE CHANGES</button>
            </div>
        </div>
    );
}
