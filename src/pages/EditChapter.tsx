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
    const [editMode, setEditMode] = useState<'rich' | 'html'>('rich');
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        const fetch = async () => {
            const { data } = await supabase.from('chapters').select('*, stories(title)').eq('id', id).single();
            if (data) {
                setChapter(data);
                setHtmlContent(data.content);
            }
            setLoading(false);
        };
        fetch();
    }, [id]);

    const handleUpdate = async () => {
        // 1. Sync and get final content
        const finalContent = editMode === 'rich' ? editorRef.current?.getContent() : htmlContent;

        // 2. 🧮 Auto Word Count (Strips HTML tags for accuracy)
        const plainText = finalContent.replace(/<[^>]*>/g, ' ');
        const words = plainText.trim().split(/\s+/).filter((w: string) => w.length > 0).length;

        // 3. Update Database (Saves content, count, and sets to LIVE)
        const { error } = await supabase
            .from('chapters')
            .update({
                content: finalContent,
                word_count: words,
                is_published: true
            })
            .eq('id', id);

        if (error) {
            alert(error.message);
        } else {
            alert(`✨ Chapter Saved! (${words.toLocaleString()} words added to total)`);
            navigate('/manage-stories');
        }
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Accessing Vault Records...</div>;

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{
                background: 'white',
                padding: '30px',
                maxWidth: '1000px',
                margin: 'auto',
                border: '2px solid #3E2723',
                boxShadow: '10px 10px 0px #3E2723'
            }}>
                <h2 style={{ fontFamily: 'serif', borderBottom: '2px solid #3E2723', paddingBottom: '10px' }}>
                    EDITING: {chapter?.stories?.title} — Chapter {chapter?.chapter_number}
                </h2>

                {/* 🔄 MODE TOGGLE */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', marginTop: '20px', marginBottom: '10px' }}>
                    <button onClick={() => {
                        if (editMode === 'html') setHtmlContent(htmlContent);
                        setEditMode('rich');
                    }} style={{ padding: '5px 15px', background: editMode === 'rich' ? '#3E2723' : '#eee', color: editMode === 'rich' ? 'white' : 'black', border: 'none', cursor: 'pointer' }}>Rich Text</button>

                    <button onClick={() => {
                        if (editMode === 'rich') setHtmlContent(editorRef.current?.getContent());
                        setEditMode('html');
                    }} style={{ padding: '5px 15px', background: editMode === 'html' ? '#3E2723' : '#eee', color: editMode === 'html' ? 'white' : 'black', border: 'none', cursor: 'pointer' }}>HTML</button>
                </div>

                <div style={{ border: '1px solid #ccc' }}>
                    {editMode === 'rich' ? (
                        <Editor
                            apiKey="0dwpdw2m9932lqvdy75kj7fil1nrgcio3dk6ij0f74cemevw"
                            onInit={(evt: any, editor: any) => editorRef.current = editor}
                            initialValue={htmlContent}
                            init={{
                                height: 600,
                                menubar: false,
                                plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'wordcount', 'hr', 'paste'],
                                toolbar: 'blocks | paste | bold italic underline strikethrough | bullist numlist | alignleft aligncenter alignright alignjustify | link unlink image | blockquote hr | undo redo | code',
                                image_dimensions: true,
                                image_title: true,
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                            }}
                        />
                    ) : (
                        <textarea
                            style={{ width: '100%', height: '600px', padding: '10px', fontFamily: 'monospace', border: 'none', boxSizing: 'border-box', fontSize: '14px', resize: 'vertical' }}
                            value={htmlContent}
                            onChange={(e) => setHtmlContent(e.target.value)}
                        />
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <button onClick={() => navigate('/manage-stories')} style={{ background: '#ccc', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>CANCEL</button>
                    <button onClick={handleUpdate} style={{ background: '#3E2723', color: 'white', padding: '15px 40px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>SAVE CHANGES</button>
                </div>
            </div>
        </div>
    );
}
