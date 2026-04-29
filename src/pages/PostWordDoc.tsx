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
        const file = e.target.files?.[0];
        if (!file || !selectedStory) return alert("Select a story first!");

        setLoading(true);
        const reader = new FileReader();

        reader.onload = async (event: any) => {
            const arrayBuffer = event.target.result;
            const result = await mammoth.convertToHtml({ arrayBuffer });
            const fullHtml = result.value;

            // 🧠 SMARTER SPLITTER: 
            // Only splits if "Chapter" is inside an <h2> or starts a new paragraph <p>
            const chapterParts = fullHtml.split(/<(h2|p)>Chapter\s?\d+/i);

            // Clean up the parts (remove tiny fragments and HTML tags from the split)
            const cleanChapters = chapterParts.filter(c => c.trim().length > 50 && !c.includes('h2') && !c.includes('p'));

            if (cleanChapters.length === 0) {
                alert("Error: No chapters found. Make sure your Word doc has 'Chapter 1', 'Chapter 2' etc. as headings.");
                setLoading(false);
                return;
            }

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
            <div style={{ background: 'white', padding: '30px', maxWidth: '600px', margin: 'auto', border: '2px solid #3E2723', boxShadow: '10px 10px 0px #3E2723' }}>
                <h2 style={{ fontFamily: 'serif' }}>WORD TO CHAPTER CONVERTER</h2>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>Your Word doc must have "Chapter 1", "Chapter 2" etc. at the start of each section.</p>

                <select onChange={(e) => setSelectedStory(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '20px', border: '1px solid #3E2723' }}>
                    <option value="">Pick the story...</option>
                    {stories.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>

                <input type="file" accept=".docx" onChange={handleFileChange} disabled={loading} style={{ marginBottom: '20px' }} />

                {loading && <p style={{ fontWeight: 'bold', color: 'red' }}>ARCHIVING CHAPTERS... PLEASE WAIT.</p>}
            </div>
        </div>
    );
}
