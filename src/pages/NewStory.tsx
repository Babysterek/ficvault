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
            <div style={{ maxWidth: '900px', margin: 'auto', background: 'white', border: '1px solid #ccc', padding: '20px', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}>
                <h2 style={{ background: '#900', color: 'white', padding: '10px', margin: '-20px -20px 20px -20px' }}>Post New Work</h2>

                <div style={{ display: 'grid', gap: '15px' }}>
                    <section>
                        <label style={{ fontWeight: 'bold' }}>Rating:</label><br />
                        <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ width: '100%', padding: '5px' }}>
                            <option>Not Rated</option><option>General Audiences</option><option>Teen And Up Audiences</option><option>Mature</option><option>Explicit</option>
                        </select>
                    </section>

                    <section>
                        <label style={{ fontWeight: 'bold' }}>Fandoms:</label>
                        <input style={{ width: '100%', padding: '8px' }} value={fandoms} onChange={(e) => setFandoms(e.target.value)} placeholder="e.g. Teen Wolf" />
                    </section>

                    <section>
                        <label style={{ fontWeight: 'bold' }}>Title:</label>
                        <input style={{ width: '100%', padding: '8px', fontSize: '1.1rem' }} value={title} onChange={(e) => setTitle(e.target.value)} />
                    </section>

                    <section>
                        <label style={{ fontWeight: 'bold' }}>Summary:</label>
                        <textarea style={{ width: '100%', height: '60px', padding: '8px' }} value={summary} onChange={(e) => setSummary(e.target.value)} />
                    </section>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                        <button onClick={() => setEditMode('rich')} style={{ padding: '5px 15px', background: editMode === 'rich' ? '#900' : '#ccc', color: editMode === 'rich' ? 'white' : 'black', border: 'none' }}>Rich Text</button>
                        <button onClick={() => setEditMode('html')} style={{ padding: '5px 15px', background: editMode === 'html' ? '#900' : '#ccc', color: editMode === 'html' ? 'white' : 'black', border: 'none' }}>HTML</button>
                    </div>

                    <div style={{ background: 'white', color: 'black', border: '1px solid #ccc' }}>
                        {editMode === 'rich' ? (
                            <div className="quill-wrapper" style={{ height: '350px', marginBottom: '50px' }}>
                                <ReactQuill theme="snow" value={content} onChange={setContent} style={{ height: '300px' }} />
                            </div>
                        ) : (
                            <textarea
                                style={{ width: '100%', height: '350px', padding: '10px', fontFamily: 'monospace', fontSize: '1rem' }}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Paste your HTML here..."
                            />
                        )}
                    </div>
                </div>

                <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
                    <button
                        onClick={handlePost}
                        disabled={loading}
                        style={{ background: '#900', color: 'white', padding: '10px 40px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}
                    >
                        {loading ? "Posting..." : "Post"}
                    </button>
                </div>
            </div>
        </div>
    );
}
