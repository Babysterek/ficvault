import { useState } from 'react';
import { supabase } from '../supabase';
import JSZip from 'jszip';

export default function PostEpub() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleEpubUpload = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        setStatus('Unzipping archive...');
        const zip = new JSZip();

        try {
            const contents = await zip.loadAsync(file);
            const title = file.name.replace('.epub', '');

            // 1. Create the Work Entry in the Vault
            const { data: storyData, error: storyError } = await supabase
                .from('stories')
                .insert([{
                    title,
                    author: 'Babysterek',
                    status: 'published'
                }])
                .select().single();

            if (storyError) throw storyError;

            // 2. Identify all story files (HTML/XHTML)
            const htmlFiles = Object.keys(contents.files).filter(path =>
                path.endsWith('.xhtml') || path.endsWith('.html')
            ).sort();

            setStatus(`Extracting ${htmlFiles.length} files...`);

            let chapterNum = 1;
            for (const path of htmlFiles) {
                const text = await contents.files[path].async("string");

                // 🛑 Filter out small files like covers or empty title pages
                if (text.replace(/<[^>]*>/g, '').length < 800) continue;

                // Strip out unnecessary head/meta tags to keep it clean
                const cleanBody = text.replace(/<head>[\s\S]*?<\/head>/g, "");

                await supabase.from('chapters').insert([{
                    story_id: storyData.id,
                    chapter_number: chapterNum,
                    title: `Chapter ${chapterNum}`,
                    content: cleanBody
                }]);
                chapterNum++;
            }

            setStatus('Success!');
            alert(`✨ EPUB Archived: "${title}" created with ${chapterNum - 1} chapters.`);
        } catch (err: any) {
            alert("Error reading EPUB: " + err.message);
        } finally {
            setLoading(false);
            setStatus('');
        }
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{
                background: 'white',
                padding: '40px',
                maxWidth: '600px',
                margin: 'auto',
                border: '2px solid #3E2723',
                boxShadow: '10px 10px 0px #3E2723',
                textAlign: 'center'
            }}>
                <h2 style={{ fontFamily: 'serif' }}>VAULT: EPUB AUTO-IMPORT</h2>
                <p style={{ color: '#666', marginBottom: '30px' }}>
                    Select an .epub file to automatically unzip and archive all chapters.
                </p>

                <label style={{
                    display: 'block',
                    padding: '40px',
                    border: '2px dashed #3E2723',
                    cursor: 'pointer',
                    background: loading ? '#f9f9f9' : 'transparent'
                }}>
                    {loading ? "DECRYPTING EPUB..." : "📁 CLICK TO UPLOAD .EPUB"}
                    <input
                        type="file"
                        accept=".epub"
                        onChange={handleEpubUpload}
                        style={{ display: 'none' }}
                        disabled={loading}
                    />
                </label>

                {status && (
                    <p style={{ marginTop: '20px', fontWeight: 'bold', color: '#3E2723' }}>
                        {status}
                    </p>
                )}
            </div>
        </div>
    );
}
