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
            // 🌟 Converts Word to HTML while keeping Chapter Headings clear
            const result = await mammoth.convertToHtml({ arrayBuffer });
            const fullHtml = result.value;

            // 🧠 THE CLEAN SPLITTER:
            // This regex looks for <h2>Chapter</h2> or <strong>Chapter</strong> 
            // It ignores simple list items from the Table of Contents.
            const chapterParts = fullHtml.split(/<(h1|h2|strong)>Chapter\s?\d+/i);

            // Filter: Only keep parts that have actual story text (more than 200 characters)
            const cleanChapters = chapterParts.filter(c => c.trim().length > 200);

            if (cleanChapters.length === 0) {
                alert("Could not detect chapters. Make sure they are marked as 'Heading' in Word.");
                setLoading(false);
                return;
            }

            // 📤 UPLOADING TO VAULT
            for (let i = 0; i < cleanChapters.length; i++) {
                await supabase.from('chapters').insert([{
                    story_id: selectedStory,
                    chapter_number: i + 1,
                    title: `Chapter ${i + 1}`,
                    content: cleanChapters[i]
                }]);
            }

            alert(`Vault Updated! Successfully added ${cleanChapters.length} chapters.`);
            setLoading(false);
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div className="vault-card" style={{ background: 'white', padding: '30px', maxWidth: '600px', margin: 'auto', border: '2px solid #3E2723' }}>
                <h2 style={{ fontFamily: 'serif' }}>VAULT: WORD IMPORT</h2>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>I will automatically skip the Table of Contents and split your 14 chapters.</p>

                <select onChange={(e) => setSelectedStory(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '20px' }}>
                    <option value="">Choose Story...</option>
                    {stories.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>

                <input type="file" accept=".docx" onChange={handleFileChange} disabled={loading} />

                {loading && <p style={{ color: 'red', fontWeight: 'bold', marginTop: '20px' }}>DECRYPTING & SPLITTING... PLEASE WAIT.</p>}
            </div>
        </div>
    );
}
