import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// 🛠️ Full AO3 Toolbar Configuration
const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // Formatting
        ['link', 'image'],                                // Links and GIF/Image URLs
        ['blockquote', { 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],                                // Alignment
        ['clean']                                         // Clear formatting
    ],
};

export default function NewStory() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState<'rich' | 'html'>('rich');

    // AO3 Story Fields
    const [title, setTitle] = useState('');
    const [rating, setRating] = useState('Not Rated');
    const [warnings, setWarnings] = useState('No Archive Warnings Apply');
    const [fandoms, setFandoms] = useState('');
    const [relationships, setRelationships] = useState('');
    const [characters, setCharacters] = useState('');
    const [tags, setTags] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');

    const handlePost = async () => {
        if (!title || !fandoms || !content) {
            return alert("Title, Fandom, and Content are required!");
        }

        setLoading(true);
        try {
            // 1. Create the Main Story Entry
            const { data: storyData, error: storyError } = await supabase
                .from('stories')
                .insert([{
                    title,
                    rating,
                    archive_warnings: warnings,
                    fandoms,
                    relationships,
                    characters,
                    additional_tags: tags,
                    summary,
                    author: 'Babysterek'
                }])
                .select().single();

            if (storyError) throw storyError;

            // 2. Create the first Chapter with the Text content
            const { error: chapError } = await supabase
                .from('chapters')
                .insert([{
                    story_id: storyData.id,
                    chapter_number: 1,
                    content: content,
                    title: 'Chapter 1'
                }]);

            if (chapError) throw chapError;

            alert("✨ Work Published to the Archive!");
            navigate('/archive');
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#eee', minHeight: '100vh', padding: '20px', textAlign: 'left', color: '#000' }}>
            <div style={{ maxWidth: '900px', margin: 'auto', background: 'white', border: '1px solid #ccc', padding: '20px', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}>
                <h2 style={{ background: '#900', color: 'white', padding: '10px', margin: '-20px -20px 20px -20px' }}>Post New Work</h2>

                <div style={{ display: 'grid', gap: '15px' }}>
                    {/* PREFACE SECTION */}
                    <fieldset style={{ border: '1px solid #ccc', padding: '15px' }}>
                        <legend style={{ fontWeight: 'bold' }}>Preface</legend>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Rating: </label>
                            <select value={rating} onChange={(e) => setRating(e.target.value)}>
                                <option>Not Rated</option>
                                <option>General Audiences</option>
                                <option>Teen And Up Audiences</option>
                                <option>Mature</option>
                                <option>Explicit</option>
                            </select>
                        </div>
                        <div>
                            <label>Warnings: </label>
                            <select value={warnings} onChange={(e) => setWarnings(e.target.value)}>
                                <option>No Archive Warnings Apply</option>
                                <option>Graphic Depictions Of Violence</option>
                                <option>Major Character Death</option>
                            </select>
                        </div>
                    </fieldset>

                    {/* TAGS SECTION */}
                    <fieldset style={{ border: '1px solid #ccc', padding: '15px' }}>
                        <legend style={{ fontWeight: 'bold' }}>Tags</legend>
                        <input style={{ width: '100%', marginBottom: '10px', padding: '8px' }} placeholder="Fandoms (e.g. Teen Wolf)" value={fandoms} onChange={(e) => setFandoms(e.target.value)} />
                        <input style={{ width: '100%', marginBottom: '10px', padding: '8px' }} placeholder="Relationships" value={relationships} onChange={(e) => setRelationships(e.target.value)} />
                        <input style={{ width: '100%', marginBottom: '10px', padding: '8px' }} placeholder="Characters" value={characters} onChange={(e) => setCharacters(e.target.value)} />
                        <input style={{ width: '100%', padding: '8px' }} placeholder="Additional Tags" value={tags} onChange={(e) => setTags(e.target.value)} />
                    </fieldset>

                    {/* DESCRIPTION SECTION */}
                    <fieldset style={{ border: '1px solid #ccc', padding: '15px' }}>
                        <legend style={{ fontWeight: 'bold' }}>Description</legend>
                        <input style={{ width: '100%', fontSize: '1.2rem', marginBottom: '10px', padding: '8px' }} placeholder="Work Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <textarea style={{ width: '100%', height: '60px', padding: '8px' }} placeholder="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
                    </fieldset>

                    {/* WORK TEXT SECTION */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', marginBottom: '5px' }}>
                        <button onClick={() => setEditMode('rich')} style={{ padding: '5px 10px', background: editMode === 'rich' ? '#900' : '#ddd', color: editMode === 'rich' ? 'white' : 'black' }}>Rich Text</button>
                        <button onClick={() => setEditMode('html')} style={{ padding: '5px 10px', background: editMode === 'html' ? '#900' : '#ddd', color: editMode === 'html' ? 'white' : 'black' }}>HTML</button>
                    </div>

                    <div style={{ background: 'white', color: 'black', border: '1px solid #ccc', minHeight: '450px' }}>
                        {editMode === 'rich' ? (
                            <div className="quill-wrapper" style={{ height: '400px' }}>
                                <ReactQuill
                                    theme="snow"
                                    modules={modules}
                                    value={content}
                                    onChange={setContent}
                                    style={{ height: '350px' }}
                                />
                            </div>
                        ) : (
                            <textarea
                                style={{ width: '100%', height: '400px', padding: '10px', fontFamily: 'monospace', fontSize: '1rem' }}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Paste your HTML here..."
                            />
                        )}
                    </div>
                </div>

                <div style={{ marginTop: '50px', textAlign: 'right' }}>
                    <button
                        onClick={handlePost}
                        disabled={loading}
                        style={{ background: '#900', color: 'white', padding: '10px 40px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}
                    >
                        {loading ? "Archiving..." : "Post"}
                    </button>
                </div>
            </div>
        </div>
    );
}
