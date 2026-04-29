import { useState } from 'react';
import { supabase } from '../supabase';
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
            let fullText = "";
            let title = file.name.replace('.epub', '');

            // 1. 📂 Find all HTML files inside the EPUB
            const htmlFiles = Object.keys(contents.files).filter(path =>
                path.endsWith('.xhtml') || path.endsWith('.html')
            ).sort();

            // 2. 🏗️ Create the Story Entry
            const { data: storyData, error: storyError } = await supabase
                .from('stories')
                .insert([{ title, author: 'Babysterek', status: 'published' }])
                .select().single();

            if (storyError) throw storyError;

            // 3. 📖 Extract content from each file as a Chapter
            let chapterNum = 1;
            for (const path of htmlFiles) {
                const text = await contents.files[path].async("string");

                // Skip files that are too small (like covers or title pages)
                if (text.length < 1000) continue;

                // Clean up the code a bit
                const cleanBody = text.replace(/<head>[\s\S]*?<\/head>/g, "");

                await supabase.from('chapters').insert([{
                    story_id: storyData.id,
                    chapter_number: chapterNum,
                    title: `Chapter ${chapterNum}`,
                    content: cleanBody
                }]);
                chapterNum++;
            }

            alert(`✨ EPUB Uploaded! Created "${title}" with ${chapterNum - 1} chapters.`);
        } catch (err: any) {
            alert("EPUB Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div className="vault-card" style={{ background: 'white', padding: '40px', maxWidth: '600px', margin: 'auto', border: '2px solid #3E2723', boxShadow: '10px 10px 0px #3E2723' }}>
                <h2 style={{ fontFamily: 'serif' }}>VAULT: EPUB AUTO-IMPORT</h2>
                <p style={{ color: '#666' }}>Upload an .epub file. I will unzip and extract all chapters into the vault.</p>

                <label style={{ display: 'block', padding: '30px', border: '2px dashed #3E2723', cursor: 'pointer', textAlign: 'center', marginTop: '20px' }}>
                    {loading ? "DECRYPTING..." : "SELECT EPUB FILE"}
                    <input type="file" accept=".epub" onChange={handleEpubUpload} style={{ display: 'none' }} disabled={loading} />
                </label>
            </div>
        </div>
    );
}
