import { useState } from 'react';
import { supabase } from '../supabase';
import mammoth from 'mammoth';

export default function PostWordDoc() {
    const [loading, setLoading] = useState(false);

    const handleFile = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);
        const reader = new FileReader();
        reader.onload = async (event: any) => {
            const result = await mammoth.convertToHtml({ arrayBuffer: event.target.result });
            const html = result.value;
            const title = file.name.replace('.docx', '');

            const { data: storyData } = await supabase.from('stories').insert([{ title, author: 'Babysterek' }]).select().single();
            if (storyData) {
                // Splits text every time it sees "Chapter" followed by a number
                const parts = html.split(/Chapter\s+\d+/i).filter(p => p.length > 500);
                for (let i = 0; i < parts.length; i++) {
                    await supabase.from('chapters').insert([{
                        story_id: storyData.id,
                        chapter_number: i + 1,
                        content: parts[i],
                        title: `Chapter ${i + 1}`
                    }]);
                }
                alert("✨ Archive Complete! Split " + parts.length + " chapters.");
            }
            setLoading(false);
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '40px', maxWidth: '600px', margin: 'auto', border: '2px solid #3E2723' }}>
                <h2>WORD AUTO-IMPORT</h2>
                <p>I will detect the title and split the chapters automatically.</p>
                <input type="file" accept=".docx" onChange={handleFile} disabled={loading} />
                {loading && <p style={{ color: 'red', fontWeight: 'bold' }}>ARCHIVING...</p>}
            </div>
        </div>
    );
}
