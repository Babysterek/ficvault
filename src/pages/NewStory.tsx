import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function NewStory() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // AO3 Fields
    const [title, setTitle] = useState('');
    const [rating, setRating] = useState('Not Rated');
    const [warnings, setWarnings] = useState('No Archive Warnings Apply');
    const [fandoms, setFandoms] = useState('');
    const [relationships, setRelationships] = useState('');
    const [characters, setCharacters] = useState('');
    const [tags, setTags] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState(''); // The Rich Text

    const handlePost = async () => {
        if (!title || !fandoms || !content) return alert("Title, Fandom, and Content are required!");
        setLoading(true);

        try {
            // 1. Create the Story Entry
            const { data: storyData, error: storyError } = await supabase
                .from('stories')
                .insert([{
                    title, rating, archive_warnings: warnings,
                    fandoms, relationships, characters,
                    additional_tags: tags, summary, author: 'Babysterek'
                }])
                .select()
                .single();

            if (storyError) throw storyError;

            // 2. Create Chapter 1 with the text
            const { error: chapError } = await supabase
                .from('chapters')
                .insert([{
                    story_id: storyData.id,
                    chapter_number: 1,
                    content: content,
                    title: 'Chapter 1'
                }]);

            if (chapError) throw chapError;

            alert("✨ Work Published Successfully!");
            navigate('/archive');
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#eee', minHeight: '100vh', padding: '20px', textAlign: 'left', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '900px', margin: 'auto', background: 'white', border: '1px solid #ccc', padding: '20px' }}>
                <h2 style={{ background: '#900', color: 'white', padding: '10px', margin: '-20px -20px 20px -20px' }}>Post New Work</h2>

                {/* PREFACE */}
                <fieldset style={{ marginBottom: '20px' }}>
                    <legend>Preface</legend>
                    <label>Rating: </label>
                    <select value={rating} onChange={(e) => setRating(e.target.value)}>
                        <option>Not Rated</option><option>General Audiences</option><option>Teen And Up Audiences</option><option>Mature</option><option>Explicit</option>
                    </select>
                    <br /><br />
                    <label>Archive Warnings: </label>
                    <select value={warnings} onChange={(e) => setWarnings(e.target.value)}>
                        <option>No Archive Warnings Apply</option><option>Choose Not To Use Archive Warnings</option><option>Graphic Depictions Of Violence</option><option>Major Character Death</option>
                    </select>
                </fieldset>

                {/* TAGS */}
                <fieldset style={{ marginBottom: '20px' }}>
                    <legend>Tags</legend>
                    <label>Fandoms: </label>
                    <input style={{ width: '100%' }} value={fandoms} onChange={(e) => setFandoms(e.target.value)} placeholder="e.g. Teen Wolf" />
                    <label>Relationships: </label>
                    <input style={{ width: '100%' }} value={relationships} onChange={(e) => setRelationships(e.target.value)} placeholder="e.g. Derek Hale/Stiles Stilinski" />
                    <label>Characters: </label>
                    <input style={{ width: '100%' }} value={characters} onChange={(e) => setCharacters(e.target.value)} />
                    <label>Additional Tags: </label>
                    <input style={{ width: '100%' }} value={tags} onChange={(e) => setTags(e.target.value)} />
                </fieldset>

                {/* DESCRIPTION */}
                <fieldset style={{ marginBottom: '20px' }}>
                    <legend>Description</legend>
                    <label>Title: </label>
                    <input style={{ width: '100%', fontSize: '1.2rem' }} value={title} onChange={(e) => setTitle(e.target.value)} />
                    <label>Summary: </label>
                    <textarea style={{ width: '100%', height: '80px' }} value={summary} onChange={(e) => setSummary(e.target.value)} />
                </fieldset>

                {/* CONTENT */}
                <fieldset>
                    <legend>Work Text</legend>
                    <ReactQuill theme="snow" value={content} onChange={setContent} style={{ height: '400px', marginBottom: '50px' }} />
                </fieldset>

                <button
                    onClick={handlePost}
                    disabled={loading}
                    style={{ background: '#900', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {loading ? "Posting..." : "Post"}
                </button>
            </div>
        </div>
    );
}
