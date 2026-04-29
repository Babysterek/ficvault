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
                // Splits by "Chapter" and ignores short snippets (like Table of Contents)
                const parts = html.split(/Chapter\s+\d+/i).filter(p => p.length > 500);
                for (let i = 0; i < parts.length; i++) {
                    await supabase.from('chapters').insert([{ story_id: storyData.id, chapter_number: i + 1, content: parts[i], title: `Chapter ${i + 1}` }]);
                }
                alert("✨ Successfully split and archived " + parts.length + " chapters.");
            }
            setLoading(false);
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '40px', maxWidth: '600px', margin: 'auto', border: '2px solid #3E2723' }}>
                <h2>VAULT: AUTO-IMPORT</h2>
                <p>I will automatically detect the title and split the 14 chapters from your .docx file.</p>
                <label style={{ display: 'block', padding: '30px', border: '2px dashed #3E2723', cursor: 'pointer', textAlign: 'center' }}>
                    {loading ? "DECRYPTING..." : "UPLOAD WORD FILE"}
                    <input type="file" accept=".docx" onChange={handleFile} style={{ display: 'none' }} />
                </label>
            </div>
        </div>
    );
}
