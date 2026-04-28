import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Reader({ user }: any) {
    const { id } = useParams(); // Gets the ID from the URL
    const [story, setStory] = useState<any>(null);
    const [chapters, setChapters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFullStory = async () => {
            // 1. Get the Story Details
            const { data: storyData } = await supabase
                .from('stories')
                .select('*')
                .eq('id', id)
                .single();

            // 2. Get the Chapters
            const { data: chapterData } = await supabase
                .from('chapters')
                .select('*')
                .eq('story_id', id)
                .order('chapter_number', { ascending: true });

            if (storyData) setStory(storyData);
            if (chapterData) setChapters(chapterData);
            setLoading(false);
        };

        fetchFullStory();
    }, [id]);

    if (loading) return <div style={{ padding: '50px' }}>Unlocking the vault...</div>;
    if (!story) return <div style={{ padding: '50px' }}>Story not found.</div>;

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '40px', textAlign: 'left' }}>
            <Link to="/archive" style={{ color: '#3E2723', textDecoration: 'none', fontSize: '0.8rem' }}>← BACK TO ARCHIVE</Link>

            <div style={{ border: '1px solid #3E2723', padding: '20px', marginTop: '20px', background: 'white' }}>
                <p><strong>Author:</strong> {story.author || 'Anonymous'}</p>
                <p><strong>Fandom:</strong> {story.fandom || 'Original Work'}</p>
            </div>

            <h1 style={{ fontFamily: 'serif', marginTop: '40px' }}>{story.title}</h1>

            <div className="story-content" style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
                {chapters.length > 0 ? (
                    chapters.map((ch) => (
                        <div key={ch.id} style={{ marginBottom: '40px' }}>
                            <h2 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                                Chapter {ch.chapter_number}: {ch.title}
                            </h2>
                            <div dangerouslySetInnerHTML={{ __html: ch.content }} />
                        </div>
                    ))
                ) : (
                    <p style={{ fontStyle: 'italic', color: '#666' }}>
                        This story has no chapters yet.
                        {story.file_url && <span> <a href={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/epubs/${story.file_url}`} target="_blank" rel="noreferrer">Download EPUB</a></span>}
                    </p>
                )}
            </div>

            <hr style={{ margin: '40px 0' }} />
            <h3>Comments</h3>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>Comments are currently disabled for this archive.</p>
        </div>
    );
}
