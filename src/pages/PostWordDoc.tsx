import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import mammoth from 'mammoth';

export default function PostWordDoc() {
    const [stories, setStories] = useState<any[]>([]);
    const [selectedStory, setSelectedStory] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStories = async () => {
            const { data } = await supabase.from('stories').select('id, title');
            if (data) setStories(data);
        };
        fetchStories();
    }, []);

    const handleFileChange = async (e: any) => {
        const file = e.target.files[0];
        if (!file || !selectedStory) return alert("Select a story first!");

        setLoading(true);
        const reader = new FileReader();

        reader.onload = async (event: any) => {
            const arrayBuffer = event.target.result;
            const result = await mammoth.convertToHtml({ arrayBuffer });
            const fullHtml = result.value;

            // 🧠 THE BRAIN: This splits the text every time it sees "Chapter"
            // It looks for <h2>Chapter</h2> or <p>Chapter 1</p> etc.
            const chapterParts = fullHtml.split(/Chapter\s?\d+/i);

            // Remove the first empty part if it exists
            const cleanChapters = chapterParts.filter(c => c.trim().length > 10);

            for (let i = 0; i < cleanChapters.length; i++) {
                await supabase.from('chapters').insert([{
                    story_id: selectedStory,
                    chapter_number: i + 1,
                    title: `Chapter ${i + 1}`,
                    content: cleanChapters[i]
                }]);
            }

            alert(`Successfully added ${cleanChapters.length} chapters!`);
            setLoading(false);
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '30px', maxWidth: '600px', margin: 'auto', border: '2px solid #3E2723' }}>
                <h2>WORD TO CHAPTER CONVERTER</h2>
                <p style={{ fontSize: '0.8rem' }}>Make sure your Word doc has the word "Chapter" before each new section.</p>

                <select onChange={(e) => setSelectedStory(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '20px' }}>
                    <option value="">Pick the story to add chapters to...</option>
                    {stories.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>

                <input type="file" accept=".docx" onChange={handleFileChange} disabled={loading} />

                {loading && <p>Processing and splitting chapters... please wait.</p>}
            </div>
        </div>
    );
}
