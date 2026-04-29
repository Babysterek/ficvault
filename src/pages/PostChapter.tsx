import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the look of the editor

export default function PostChapter() {
    const [stories, setStories] = useState<any[]>([]);
    const [selectedStory, setSelectedStory] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // This holds the "AO3" text
    const [num, setNum] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStories = async () => {
            const { data } = await supabase.from('stories').select('id, title');
            if (data) setStories(data);
        };
        fetchStories();
    }, []);

    const handleSave = async () => {
        if (!selectedStory || !content) return alert("Please select a story and write some content!");
        setLoading(true);

        const { error } = await supabase.from('chapters').insert([{
            story_id: selectedStory,
            chapter_number: num,
            title: title || `Chapter ${num}`,
            content: content
        }]);

        setLoading(false);
        if (error) alert(error.message);
        else {
            alert("✨ Chapter Published to the Archive!");
            setContent('');
            setTitle('');
            setNum(num + 1);
        }
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div className="vault-card" style={{ background: 'white', padding: '30px', maxWidth: '800px', margin: 'auto', textAlign: 'left', border: '1px solid #3E2723' }}>
                <h2 style={{ fontFamily: 'serif', borderBottom: '2px solid #3E2723', paddingBottom: '10px' }}>POST NEW CHAPTER (AO3 STYLE)</h2>

                <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                    <label style={{ fontWeight: 'bold', display: 'block' }}>SELECT WORK</label>
                    <select onChange={(e) => setSelectedStory(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px' }}>
                        <option value="">Choose from your works...</option>
                        {stories.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 2 }}>
                        <label style={{ fontWeight: 'bold' }}>CHAPTER TITLE</label>
                        <input placeholder="e.g. The Beginning" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontWeight: 'bold' }}>CHAPTER NUMBER</label>
                        <input type="number" value={num} onChange={(e) => setNum(parseInt(e.target.value))} style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                    </div>
                </div>

                <label style={{ fontWeight: 'bold' }}>WORK TEXT</label>
                <div style={{ marginTop: '5px', background: 'white' }}>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        style={{ height: '400px', marginBottom: '50px' }}
                    />
                </div>

                <button
                    onClick={handleSave}
                    disabled={loading}
                    style={{ width: '100%', background: '#3E2723', color: 'white', padding: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    {loading ? 'POSTING...' : 'POST TO ARCHIVE'}
                </button>
            </div>
        </div>
    );
}
