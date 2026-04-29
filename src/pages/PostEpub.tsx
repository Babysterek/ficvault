import { useState } from 'react';
import { supabase } from '../supabase';
// @ts-ignore
import JSZip from 'jszip';

export default function PostEpub() {
    const [loading, setLoading] = useState(false);

    const handleEpubUpload = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const zip = new JSZip();

        try {
            const contents = await zip.loadAsync(file);
            const title = file.name.replace('.epub', '');

            // 1. Create the Story Entry
            const { data: storyData, error: storyError } = await supabase
                .from('stories')
                .insert([{ title, author: 'Babysterek', status: 'published' }])
                .select().single();

            if (storyError) throw storyError;

            // 2. Find and process HTML/XHTML files
            const htmlFiles = Object.keys(contents.files).filter(path =>
                path.endsWith('.xhtml') || path.endsWith('.html')
            ).sort();

            let chapterNum = 1;
            for (const path of htmlFiles) {
                const text = await contents.files[path].async("string");

                // Skip covers/title pages (files with very little text)
                if (text.length < 800) continue;

                // Simple clean up of HTML tags
                const cleanBody = text.replace(/<head>[\s\S]*?<\/head>/g, "");

                await supabase.from('chapters').insert([{
                    story_id: storyData.id,
                    chapter_number: chapterNum,
                    title: `Chapter ${chapterNum}`,
                    content: cleanBody
                }]);
                chapterNum++;
            }

            alert(`✨ SUCCESS! Created "${title}" with ${chapterNum - 1} chapters.`);
        } catch (err: any) {
            alert("Error reading EPUB: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '40px', maxWidth: '600px', margin: 'auto', border: '2px solid #3E2723', boxShadow: '10px 10px 0px #3E2723' }}>
                <h2 style={{ fontFamily: 'serif' }}>EPUB AUTO-IMPORT</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>I will unzip the EPUB and build your vault entry automatically.</p>

                <label style={{ display: 'block', padding: '30px', border: '2px dashed #3E2723', cursor: 'pointer', textAlign: 'center' }}>
                    {loading ? "DECRYPTING..." : "CLICK TO UPLOAD .EPUB"}
                    <input type="file" accept=".epub" onChange={handleEpubUpload} style={{ display: 'none' }} disabled={loading} />
                </label>
            </div>
        </div>
    );
}
