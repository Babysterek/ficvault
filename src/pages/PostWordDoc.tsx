import { useState } from 'react';
import { supabase } from '../supabase';
import mammoth from 'mammoth';

export default function PostWordDoc() {
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const reader = new FileReader();

        reader.onload = async (event: any) => {
            const arrayBuffer = event.target.result;
            const result = await mammoth.convertToHtml({ arrayBuffer });
            const fullHtml = result.value;

            // 1. 🧠 FIND THE TITLE (Usually the first <h1> or first line)
            // We strip HTML tags to get the clean text for the title
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = fullHtml;
            const docTitle = tempDiv.querySelector('h1')?.innerText || file.name.replace('.docx', '');

            // 2. 🏗️ CREATE THE NEW STORY IN THE VAULT
            const { data: storyData, error: storyError } = await supabase
                .from('stories')
                .insert([{
                    title: docTitle,
                    author: 'Babysterek', // You can change this
                    status: 'published'
                }])
                .select().single();

            if (storyError) {
                alert("Vault Error: " + storyError.message);
                setLoading(false);
                return;
            }

            // 3. ☢️ NUCLEAR SPLITTER (Optimized for FicHub)
            const regex = /Chapter\s+\d+/gi;
            const matches = [];
            let match;
            while ((match = regex.exec(fullHtml)) !== null) {
                matches.push({ index: match.index });
            }

            const chapterContents: string[] = [];
            for (let i = 0; i < matches.length; i++) {
                const start = matches[i].index;
                const end = matches[i + 1] ? matches[i + 1].index : fullHtml.length;
                const body = fullHtml.substring(start, end);

                // Only keep long parts (ignores Table of Contents)
                if (body.replace(/<[^>]*>/g, '').length > 800) {
                    chapterContents.push(body);
                }
            }

            // 4. 📤 UPLOAD CHAPTERS TO THE NEW STORY
            for (let i = 0; i < chapterContents.length; i++) {
                await supabase.from('chapters').insert([{
                    story_id: storyData.id,
                    chapter_number: i + 1,
                    title: `Chapter ${i + 1}`,
                    content: chapterContents[i]
                }]);
            }

            alert(`✨ SUCCESS! New work "${docTitle}" created with ${chapterContents.length} chapters.`);
            setLoading(false);
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div className="vault-card" style={{ background: 'white', padding: '40px', maxWidth: '600px', margin: 'auto', border: '2px solid #3E2723', boxShadow: '10px 10px 0px #3E2723' }}>
                <h2 style={{ fontFamily: 'serif' }}>VAULT: ONE-CLICK IMPORT</h2>
                <p style={{ color: '#666', marginBottom: '30px' }}>Upload your Word doc. I will create the work and split all chapters automatically.</p>

                <label style={{
                    display: 'block',
                    padding: '20px',
                    border: '2px dashed #3E2723',
                    cursor: 'pointer',
                    textAlign: 'center',
                    background: loading ? '#eee' : 'transparent'
                }}>
                    {loading ? "ARCHIVING..." : "CLICK TO UPLOAD .DOCX"}
                    <input type="file" accept=".docx" onChange={handleFileChange} disabled={loading} style={{ display: 'none' }} />
                </label>

                {loading && (
                    <div style={{ marginTop: '20px' }}>
                        <p style={{ fontWeight: 'bold', color: 'red' }}>Creating story and decrypting 14 chapters...</p>
                        <progress style={{ width: '100%' }}></progress>
                    </div>
                )}
            </div>
        </div>
    );
}
