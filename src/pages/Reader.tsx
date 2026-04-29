import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Reader({ user }: any) {
    const { id } = useParams();
    const [story, setStory] = useState<any>(null);
    const [chapters, setChapters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFullStory = async () => {
            const { data: storyData } = await supabase.from('stories').select('*').eq('id', id).single();
            const { data: chapterData } = await supabase.from('chapters').select('*').eq('story_id', id).order('chapter_number', { ascending: true });

            if (storyData) setStory(storyData);
            if (chapterData) setChapters(chapterData);
            setLoading(false);
        };
        fetchFullStory();
    }, [id]);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Unlocking the vault...</div>;
    if (!story) return <div style={{ padding: '50px', textAlign: 'center' }}>Story not found.</div>;

    return (
        <div style={{ background: '#F2B29A', minHeight: '100vh', padding: '20px 10px' }}>
            <div style={{
                maxWidth: '900px',
                margin: 'auto',
                background: 'white',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                textAlign: 'left'
            }}>
                <Link to="/archive" style={{ color: '#3E2723', textDecoration: 'none', fontWeight: 'bold' }}>← BACK TO ARCHIVE</Link>

                <header style={{ borderBottom: '2px solid #3E2723', marginTop: '20px', paddingBottom: '20px' }}>
                    <h1 style={{ fontFamily: 'serif', fontSize: '2.5rem', margin: '0 0 10px 0' }}>{story.title}</h1>
                    <p style={{ margin: '5px 0' }}><strong>By:</strong> {story.author}</p>
                    <p style={{ margin: '5px 0' }}><strong>Fandom:</strong> {story.fandoms || 'Original Work'}</p>
                    <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#666' }}>{story.summary}</p>
                </header>

                <main style={{ marginTop: '40px' }}>
                    {chapters.map((ch) => (
                        <div key={ch.id} style={{ marginBottom: '60px' }}>
                            <h2 style={{
                                fontFamily: 'serif',
                                textAlign: 'center',
                                borderBottom: '1px double #ccc',
                                paddingBottom: '10px',
                                marginBottom: '30px'
                            }}>
                                {ch.title}
                            </h2>
                            <div
                                className="story-text"
                                style={{
                                    lineHeight: '1.8',
                                    fontSize: '1.15rem',
                                    fontFamily: 'Georgia, serif',
                                    color: '#222'
                                }}
                                dangerouslySetInnerHTML={{ __html: ch.content }}
                            />
                        </div>
                    ))}
                </main>

                <footer style={{ borderTop: '2px solid #3E2723', marginTop: '50px', paddingTop: '20px', textAlign: 'center' }}>
                    <Link to="/archive" style={{ color: '#3E2723', fontWeight: 'bold' }}>Return to the Vault</Link>
                </footer>
            </div>
        </div>
    );
}
