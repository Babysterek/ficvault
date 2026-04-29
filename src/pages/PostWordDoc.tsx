import { useState } from 'react';
import { supabase } from '../supabase';
import mammoth from 'mammoth';

export default function PostWordDoc() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleFile = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setStatus('Reading document...');
        const reader = new FileReader();

        reader.onload = async (event: any) => {
            try {
                const arrayBuffer = event.target.result;
                const result = await mammoth.convertToHtml({ arrayBuffer });
                const html = result.value;
                const title = file.name.replace('.docx', '');

                setStatus('Creating story entry...');
                const { data: storyData, error: storyError } = await supabase
                    .from('stories')
                    .insert([{
                        title,
                        author: 'Babysterek',
                        status: 'published',
                        is_complete: true
                    }])
                    .select().single();

                if (storyError) throw storyError;

                setStatus('Splitting chapters...');
                // Splits text every time it sees "Chapter" followed by a number
                // Filters out Table of Contents links by checking content length
                const parts = html.split(/Chapter\s+\d+/i).filter(p => p.replace(/<[^>]*>/g, '').trim().length > 500);

                if (parts.length === 0) {
                    // Fallback if no chapter markers found
                    await supabase.from('chapters').insert([{
                        story_id: storyData.id,
                        chapter_number: 1,
                        content: html,
                        title: 'Full Story'
                    }]);
                    alert("No chapter markers found. Uploaded as a single chapter.");
                } else {
                    for (let i = 0; i < parts.length; i++) {
                        setStatus(`Uploading Chapter ${i + 1}...`);
                        await supabase.from('chapters').insert([{
                            story_id: storyData.id,
                            chapter_number: i + 1,
                            content: parts[i],
                            title: `Chapter ${i + 1}`
                        }]);
                    }
                    alert(`✨ Success! Archived "${title}" with ${parts.length} chapters.`);
                }
            } catch (err: any) {
                alert("Error: " + err.message);
            } finally {
                setLoading(false);
                setStatus('');
            }
        };
        reader.readAsArrayBuffer(file);
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
                <h2 style={{ fontFamily: 'serif' }}>VAULT: WORD AUTO-IMPORT</h2>
                <p style={{ color: '#666', marginBottom: '30px' }}>
                    Upload a .docx file. I will detect the title and split the chapters automatically.
                </p>

                <label style={{
                    display: 'block',
                    padding: '40px',
                    border: '2px dashed #3E2723',
                    cursor: 'pointer',
                    background: loading ? '#f9f9f9' : 'transparent'
                }}>
                    {loading ? "PROCESSING..." : "📁 CLICK TO UPLOAD .DOCX"}
                    <input
                        type="file"
                        accept=".docx"
                        onChange={handleFile}
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
