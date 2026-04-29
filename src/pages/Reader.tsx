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
        const fetchChapter = async () => {
            const { data } = await supabase
                .from('chapters')
                .select('*, stories(title)')
                .eq('id', id)
                .single();
            if (data) setChapter(data);
            setLoading(false);
        };
        fetchChapter();
    }, [id]);

    const handleUpdate = async () => {
        const newContent = editorRef.current ? editorRef.current.getContent() : '';
        const { error } = await supabase
            .from('chapters')
            .update({ content: newContent })
            .eq('id', id);

        if (error) {
            alert(error.message);
        } else {
            alert("✨ Chapter content updated and archived!");
            navigate('/manage-stories');
        }
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Decrypting chapter data...</div>;

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{
                background: 'white',
                padding: '30px',
                maxWidth: '1000px',
                margin: 'auto',
                textAlign: 'left',
                border: '1px solid #3E2723',
                boxShadow: '10px 10px 0px #3E2723'
            }}>
                <h2 style={{ fontFamily: 'serif', borderBottom: '2px solid #3E2723', paddingBottom: '10px' }}>
                    EDITING: {chapter?.stories?.title} (Chapter {chapter?.chapter_number})
                </h2>

                <div style={{ marginTop: '20px', border: '1px solid #ccc' }}>
                    <Editor
                        apiKey="0dwpdw2m9932lqvdy75kj7fil1nrgcio3dk6ij0f74cemevw"
                        onInit={(_evt: any, editor: any) => editorRef.current = editor}
                        initialValue={chapter?.content}
                        init={{
                            height: 600,
                            menubar: true,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                            ],
                            // 🌟 SAME AO3 TOOLBAR AS POSTING PAGE
                            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | removeformat | code help',
                            image_dimensions: true,
                            image_title: true,
                            automatic_uploads: true,
                            file_picker_types: 'image',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                    />
                </div>

                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                        onClick={() => navigate('/manage-stories')}
                        style={{ background: '#ccc', padding: '10px 20px', border: 'none', cursor: 'pointer' }}
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={handleUpdate}
                        style={{
                            background: '#3E2723',
                            color: 'white',
                            padding: '15px 40px',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        SAVE CHANGES
                    </button>
                </div>
            </div>
        </div>
    );
}
