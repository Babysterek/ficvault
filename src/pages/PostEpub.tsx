import { useState } from 'react';
import { supabase } from '../supabase';
// @ts-ignore
import JSZip from 'jszip';

export default function PostEpub() {
    const [loading, setLoading] = useState(false);

    const handleEpub = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLoading(true);

        const zip = new JSZip();
        const contents = await zip.loadAsync(file);
        const title = file.name.replace('.epub', '');

        const { data: story } = await supabase.from('stories')
            .insert([{ title, author: 'Babysterek', status: 'published' }])
            .select().single();

        if (story) {
            // 🌟 THE FIX: Natural Numeric Sort
            const htmlFiles = Object.keys(contents.files)
                .filter(path => path.endsWith('.xhtml') || path.endsWith('.html'))
                .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

            let chNum = 1;
            for (const path of htmlFiles) {
                const text = await contents.files[path].async("string");
                if (text.length < 1000) continue;

                await supabase.from('chapters').insert([{
                    story_id: story.id,
                    chapter_number: chNum,
                    content: text,
                    title: `Chapter ${chNum}`
                }]);
                chNum++;
            }
            alert("✨ EPUB Archived in Order!");
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '50px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '40px', border: '2px solid #3E2723', maxWidth: '600px', margin: 'auto' }}>
                <h2>EPUB AUTO-IMPORT</h2>
                <input type="file" accept=".epub" onChange={handleEpub} disabled={loading} />
            </div>
        </div>
    );
}
