import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function PostChapter() {
    const [stories, setStories] = useState<any[]>([]);
    const [selectedStory, setSelectedStory] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [num, setNum] = useState(1);

    useEffect(() => {
        const fetchStories = async () => {
            const { data } = await supabase.from('stories').select('id, title');
            if (data) setStories(data);
        };
        fetchStories();
    }, []);

    const handleSave = async () => {
        const { error } = await supabase.from('chapters').insert([{
            story_id: selectedStory,
            chapter_number: num,
            title: title,
            content: content
        }]);

        if (error) alert(error.message);
        else alert("Chapter Added!");
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div className="vault-card" style={{ background: 'white', padding: '30px', maxWidth: '600px', margin: 'auto' }}>
                <h2>ADD STORY TEXT</h2>
                <select onChange={(e) => setSelectedStory(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
                    <option>Pick a Story...</option>
                    {stories.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
                <input placeholder="Chapter Title" onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
                <input type="number" placeholder="Chapter #" onChange={(e) => setNum(parseInt(e.target.value))} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
                <textarea
                    placeholder="Paste your story text here (HTML allowed)..."
                    onChange={(e) => setContent(e.target.value)}
                    style={{ width: '100%', height: '300px', padding: '10px' }}
                />
                <button onClick={handleSave} style={{ width: '100%', marginTop: '20px' }}>SAVE CHAPTER</button>
            </div>
        </div>
    );
}
