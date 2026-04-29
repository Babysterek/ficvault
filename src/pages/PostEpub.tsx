import { useState } from 'react';
import { supabase } from '../supabase';
// @ts-ignore
import JSZip from 'jszip';

export default function PostEpub() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleEpubUpload = async (e: any, publishStatus: 'published' | 'draft') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setStatus('Unzipping archive...');
        const zip = new JSZip();

        try {
            const contents = await zip.loadAsync(file);
            const title = file.name.replace('.epub', '');

            // 1. 🏗️ Create the Work Entry with your chosen status
            const { data: storyData, error: storyError } = await supabase
                .from('stories')
                .insert([{
                    title,
                    author: 'Babysterek',
                    status: publishStatus, // 🌟 Saves as 'draft' or 'published'
                    is_complete: true
                }])
                .select().single();

            if (storyError) throw storyError;

            // 2. 📂 Identify and sort chapters numerically
            const htmlFiles = Object.keys(contents.files)
                .filter(path => path.endsWith('.xhtml') || path.endsWith('.html'))
                .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

            let chapterNum = 1;
            for (const path of htmlFiles) {
                const text = await contents.files[path].async("string");

                // Filter out small cover/title files
                if (text.replace(/<[^>]*>/g, '').length < 800) continue;

                const cleanBody = text.replace(/<head>[\s\S]*?<\/head>/g, "");

                await supabase.from('chapters').insert([{
                    story_id: storyData.id,
                    chapter_number: chapterNum,
                    title: `Chapter ${chapterNum}`,
                    content: cleanBody
                }]);
                chapterNum++;
            }

            alert(`✨ EPUB saved as ${publishStatus.toUpperCase()}! Found ${chapterNum - 1} chapters.`);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
            setStatus('');
            // Reset input so you can upload again
            (document.getElementById('epub-input') as HTMLInputElement).value = '';
        }
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '40px', maxWidth: '600px', margin: 'auto', border: '2px solid #3E2723', boxShadow: '10px 10px 0px #3E2723' }}>
                <h2 style={{ fontFamily: 'serif' }}>VAULT: EPUB IMPORT</h2>
                <p style={{ color: '#666', marginBottom: '30px' }}>Upload an EPUB and decide if it should be a Draft or Public.</p>

                <input
                    type="file"
                    id="epub-input"
                    accept=".epub"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                        const action = window.confirm("Click OK to PUBLISH immediately, or CANCEL to save as a DRAFT.")
                            ? 'published'
                            : 'draft';
                        handleEpubUpload(e, action);
                    }}
                    disabled={loading}
                />

                <button
                    onClick={() => document.getElementById('epub-input')?.click()}
                    style={{ width: '100%', padding: '20px', background: '#3E2723', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {loading ? "PROCESSING..." : "📁 SELECT EPUB FILE"}
                </button>

                {status && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{status}</p>}
            </div>
        </div>
    );
}
