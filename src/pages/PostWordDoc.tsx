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

            // 🧠 THE "GOLDILOCKS" SPLITTER
            // Splits every time it sees "Chapter" followed by a number
            // Example: <p>Chapter 1</p> or <h2>Chapter 10</h2>
            const chapterParts = fullHtml.split(/Chapter\s\d+/i);

            // Clean up: Remove the Table of Contents (usually the first few tiny parts)
            // and only keep parts with actual story text (over 500 characters)
            const cleanChapters = chapterParts.filter(c => c.trim().length > 500);

            if (cleanChapters.length === 0) {
                alert("Split failed. Keeping as one chapter.");
                await supabase.from('chapters').insert([{
                    story_id: selectedStory,
                    chapter_number: 1,
                    title: `Full Story`,
                    content: fullHtml
                }]);
            } else {
                for (let i = 0; i < cleanChapters.length; i++) {
                    await supabase.from('chapters').insert([{
                        story_id: selectedStory,
                        chapter_number: i + 1,
                        title: `Chapter ${i + 1}`,
                        content: cleanChapters[i]
                    }]);
                }
                alert(`Success! Added ${cleanChapters.length} chapters.`);
            }
            setLoading(false);
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '30px', maxWidth: '600px', margin: 'auto', border: '2px solid #3E2723' }}>
                <h2 style={{ fontFamily: 'serif' }}>VAULT: WORD IMPORT</h2>
                <select onChange={(e) => setSelectedStory(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '20px' }}>
                    <option value="">Pick the story...</option>
                    {stories.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
                <input type="file" accept=".docx" onChange={handleFileChange} disabled={loading} />
                {loading && <p style={{ color: 'red', marginTop: '20px' }}>PROCESSING CHAPTERS...</p>}
            </div>
        </div>
    );
}
