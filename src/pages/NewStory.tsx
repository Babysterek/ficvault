import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function NewStory() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState<'rich' | 'html'>('rich');

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
        if (!title || !fandoms || !content) return alert("Title, Fandom, and Content are required!");
        setLoading(true);
        try {
            const { data: storyData, error: storyError } = await supabase
                .from('stories')
                .insert([{
                    title, rating, archive_warnings: warnings,
                    fandoms, relationships, characters,
                    additional_tags: tags, summary, author: 'Babysterek'
                }])
                .select().single();

            if (storyError) throw storyError;

            const { error: chapError } = await supabase
                .from('chapters')
                .insert([{ story_id: storyData.id, chapter_number: 1, content: content, title: 'Chapter 1' }]);

            if (chapError) throw chapError;
            navigate('/archive');
        } catch (err: any) { alert(err.message); } finally { setLoading(false); }
    };

    return (
        <div style={{ background: '#eee', minHeight: '100vh', padding: '20px', textAlign: 'left', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '900px', margin: 'auto', background: 'white', border: '1px solid #ccc', padding: '20px' }}>
                <h2 style={{ background: '#900', color: 'white', padding: '10px', margin: '-20px -20px 20px -20px' }}>Post New Work</h2>

                <fieldset style={{ marginBottom: '20px' }}><legend>Preface</legend>
                    <label>Rating: </label>
                    <select value={rating} onChange={(e) => setRating(e.target.value)}>
                        <option>Not Rated</option><option>General Audiences</option><option>Teen And Up Audiences</option><option>Mature</option><option>Explicit</option>
                    </select>
                    <label style={{ marginLeft: '20px' }}>Warnings: </label>
                    <select value={warnings} onChange={(e) => setWarnings(e.target.value)}>
                        <option>No Archive Warnings Apply</option><option>Graphic Depictions Of Violence</option><option>Major Character Death</option>
                    </select>
                </fieldset>

                <fieldset style={{ marginBottom: '20px' }}><legend>Tags</legend>
                    <input style={{ width: '100%', marginBottom: '10px' }} placeholder="Fandoms" value={fandoms} onChange={(e) => setFandoms(e.target.value)} />
                    <input style={{ width: '100%', marginBottom: '10px' }} placeholder="Relationships" value={relationships} onChange={(e) => setRelationships(e.target.value)} />
                    <input style={{ width: '100%', marginBottom: '10px' }} placeholder="Characters" value={characters} onChange={(e) => setCharacters(e.target.value)} />
                    <input style={{ width: '100%' }} placeholder="Additional Tags" value={tags} onChange={(e) => setTags(e.target.value)} />
                </fieldset>

                <fieldset style={{ marginBottom: '20px' }}><legend>Description</legend>
                    <input style={{ width: '100%', fontSize: '1.2rem', marginBottom: '10px' }} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <textarea style={{ width: '100%', height: '60px' }} placeholder="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
                </fieldset>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                    <button onClick={() => setEditMode('rich')} style={{ background: editMode === 'rich' ? '#ccc' : '#eee' }}>Rich Text</button>
                    <button onClick={() => setEditMode('html')} style={{ background: editMode === 'html' ? '#ccc' : '#eee' }}>HTML</button>
                </div>

                <div style={{ minHeight: '350px', border: '1px solid #ccc', marginBottom: '20px' }}>
                    {editMode === 'rich' ? (
                        <ReactQuill theme="snow" value={content} onChange={setContent} style={{ height: '300px' }} />
                    ) : (
                        <textarea style={{ width: '100%', height: '300px', fontFamily: 'monospace' }} value={content} onChange={(e) => setContent(e.target.value)} />
                    )}
                </div>

                <button onClick={handlePost} disabled={loading} style={{ background: '#900', color: 'white', padding: '10px 20px', fontWeight: 'bold' }}>
                    {loading ? "Posting..." : "Post"}
                </button>
            </div>
        </div>
    );
}
