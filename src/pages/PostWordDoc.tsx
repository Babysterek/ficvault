import { useState } from 'react';
import { supabase } from '../supabase';
import mammoth from 'mammoth';

export default function PostWordDoc() {
    const [loading, setLoading] = useState(false);

    const handleFile = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const reader = new FileReader();
        reader.onload = async (event: any) => {
            const result = await mammoth.convertToHtml({ arrayBuffer: event.target.result });
            const html = result.value;
            const title = file.name.replace('.docx', '');

            const { data: story } = await supabase.from('stories')
                .insert([{ title, author: 'Babysterek', status: 'published' }])
                .select().single();

            if (story) {
                // 🧠 Split by "Chapter" and grab the number
                const parts = html.split(/Chapter\s+(\d+)/i);
                const chapters = [];

                for (let i = 1; i < parts.length; i += 2) {
                    const num = parseInt(parts[i]);
                    const content = parts[i + 1];
                    if (content && content.length > 500) {
                        chapters.push({ num, content });
                    }
                }

                // 🌟 THE FIX: Sort 1, 2, 3... 10, 11
                chapters.sort((a, b) => a.num - b.num);

                for (const ch of chapters) {
                    await supabase.from('chapters').insert([{
                        story_id: story.id,
                        chapter_number: ch.num,
                        content: ch.content,
                        title: `Chapter ${ch.num}`
                    }]);
                }
                alert(`✨ Successfully archived ${chapters.length} chapters in order!`);
            }
            setLoading(false);
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div style={{ padding: '50px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '40px', border: '2px solid #3E2723', maxWidth: '600px', margin: 'auto' }}>
                <h2>WORD AUTO-IMPORT</h2>
                <p>Chapters will be sorted numerically (1, 2, 3...)</p>
                <input type="file" accept=".docx" onChange={handleFile} disabled={loading} />
                {loading && <p style={{ color: 'red', fontWeight: 'bold' }}>ARCHIVING IN ORDER...</p>}
            </div>
        </div>
    );
}
