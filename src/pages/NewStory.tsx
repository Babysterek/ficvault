import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
// @ts-ignore
import { Editor } from '@tinymce/tinymce-react';

export default function NewStory() {
    const navigate = useNavigate();
    const editorRef = useRef<any>(null);
    const [loading, setLoading] = useState(false);

    // AO3 Style Fields
    const [title, setTitle] = useState('');
    const [rating, setRating] = useState('Not Rated');
    const [warnings, setWarnings] = useState('No Archive Warnings Apply');
    const [fandoms, setFandoms] = useState('');
    const [relationships, setRelationships] = useState('');
    const [characters, setCharacters] = useState('');
    const [tags, setTags] = useState('');
    const [summary, setSummary] = useState('');

    const handlePost = async () => {
        const content = editorRef.current ? editorRef.current.getContent() : '';

        if (!title || !fandoms || !content) {
            return alert("Title, Fandom, and Work Text are required!");
        }

        setLoading(true);
        try {
            // 1. Create the Story Record
            const { data: storyData, error: storyError } = await supabase
                .from('stories')
                .insert([{
                    title, rating, archive_warnings: warnings,
                    fandoms, relationships, characters,
                    additional_tags: tags, summary, author: 'Babysterek'
                }])
                .select().single();

            if (storyError) throw storyError;

            // 2. Create the first Chapter with the Editor content
            const { error: chapError } = await supabase
                .from('chapters')
                .insert([{
                    story_id: storyData.id,
                    chapter_number: 1,
                    content: content,
                    title: 'Chapter 1'
                }]);

            if (chapError) throw chapError;

            alert("✨ Work Published to the Vault!");
            navigate('/archive');
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#eee', minHeight: '100vh', padding: '20px', textAlign: 'left', color: '#000' }}>
            <div style={{ maxWidth: '1000px', margin: 'auto', background: 'white', border: '1px solid #ccc', padding: '20px', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}>
                <h2 style={{ background: '#3E2723', color: 'white', padding: '10px', margin: '-20px -20px 20px -20px' }}>FICVAULT: POST NEW WORK</h2>

                <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
                    <fieldset style={{ border: '1px solid #ccc', padding: '15px' }}>
                        <legend style={{ fontWeight: 'bold' }}>Preface</legend>
                        <label>Rating: </label>
                        <select value={rating} onChange={(e) => setRating(e.target.value)}>
                            <option>Not Rated</option><option>General Audiences</option><option>Teen And Up Audiences</option><option>Mature</option><option>Explicit</option>
                        </select>
                    </fieldset>

                    <fieldset style={{ border: '1px solid #ccc', padding: '15px' }}>
                        <legend style={{ fontWeight: 'bold' }}>Tags</legend>
                        <input style={{ width: '100%', marginBottom: '10px', padding: '8px' }} placeholder="Fandoms" value={fandoms} onChange={(e) => setFandoms(e.target.value)} />
                        <input style={{ width: '100%', padding: '8px' }} placeholder="Characters/Relationships" value={characters} onChange={(e) => setCharacters(e.target.value)} />
                    </fieldset>

                    <fieldset style={{ border: '1px solid #ccc', padding: '15px' }}>
                        <legend style={{ fontWeight: 'bold' }}>Description</legend>
                        <input style={{ width: '100%', fontSize: '1.2rem', marginBottom: '10px', padding: '8px' }} placeholder="Work Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <textarea style={{ width: '100%', height: '60px', padding: '8px' }} placeholder="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
                    </fieldset>

                    {/* THE ADVANCED EDITOR WITH YOUR API KEY */}
                    <div style={{ background: 'white', color: 'black', border: '1px solid #ccc' }}>
                        <Editor
                            apiKey="0dwpdw2m9932lqvdy75kj7fil1nrgcio3dk6ij0f74cemevw"
                            onInit={(_evt: any, editor: any) => editorRef.current = editor}
                            init={{
                                height: 600,
                                menubar: true,
                                plugins: [
                                    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                    'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'tinymceai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                                ],
                                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                tinycomments_mode: 'embedded',
                                tinycomments_author: 'Babysterek',
                                mergetags_list: [
                                    { value: 'First.Name', title: 'First Name' },
                                    { value: 'Email', title: 'Email' },
                                ],
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                image_title: true,
                                automatic_uploads: true,
                                file_picker_types: 'image'
                            }}
                        />
                    </div>
                </div>

                <div style={{ marginTop: '30px', textAlign: 'right' }}>
                    <button
                        onClick={handlePost}
                        disabled={loading}
                        style={{ background: '#3E2723', color: 'white', padding: '10px 40px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}
                    >
                        {loading ? "ARCHIVING..." : "POST TO VAULT"}
                    </button>
                </div>
            </div>
        </div>
    );
}
