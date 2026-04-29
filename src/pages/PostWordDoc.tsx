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
            let html = result.value;

            // Auto-detect Title
            const title = file.name.replace('.docx', '');
            const { data: storyData } = await supabase.from('stories').insert([{ title, author: 'Babysterek' }]).select().single();

            if (storyData) {
                // Split by "Chapter X" - Smart Filter for 14+ chapters
                const parts = html.split(/Chapter\s+\d+/i).filter(p => p.length > 500);
                for (let i = 0; i < parts.length; i++) {
                    await supabase.from('chapters').insert([{
                        story_id: storyData.id,
                        chapter_number: i + 1,
                        content: parts[i],
                        title: `Chapter ${i + 1}`
                    }]);
                }
                alert(`✨ Vault Updated: "${title}" created with ${parts.length} chapters!`);
            }
            setLoading(false);
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div style={{ padding: '50px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '40px', maxWidth: '600px', margin: 'auto', border: '2px solid #3E2723' }}>
                <h2>WORD AUTO-ARCHIVE</h2>
                <input type="file" accept=".docx" onChange={handleFile} disabled={loading} />
                {loading && <p style={{ color: 'red' }}>DECRYPTING & SPLITTING...</p>}
            </div>
        </div>
    );
}
