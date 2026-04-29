import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Home({ user }: any) {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            // 1. Fetch stories and count their chapters in one go
            let query = supabase
                .from('stories')
                .select(`
                    *,
                    chapters (id)
                `);

            // 2. Hide drafts from non-admins
            if (!user?.isAdmin) {
                query = query.eq('status', 'published');
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (!error && data) {
                setStories(data);
            }
            setLoading(false);
        };
        fetchStories();
    }, [user]);

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px', textAlign: 'left', minHeight: '100vh' }}>
            <header style={{ borderBottom: '3px solid #3E2723', marginBottom: '30px', paddingBottom: '10px' }}>
                <h1 style={{ color: '#3E2723', fontFamily: 'serif', fontSize: '2.5rem', margin: 0 }}>FICVAULT ARCHIVE</h1>
                <nav style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                    {user?.isAdmin && <Link to="/post-work" style={{ color: '#3E2723', fontWeight: 'bold' }}>+ Post New Work</Link>}
                    {user?.isAdmin && <Link to="/manage-stories" style={{ color: '#3E2723', fontWeight: 'bold' }}>Manage Vault</Link>}
                    <Link to="/my-stories" style={{ color: '#3E2723' }}>My Vault</Link>
                </nav>
            </header>

            <div>
                {loading ? (
                    <p style={{ fontStyle: 'italic' }}>Accessing records...</p>
                ) : stories.length > 0 ? (
                    stories.map((story) => {
                        const chapterCount = story.chapters?.length || 0;
                        const expected = story.expected_chapters || '?';

                        return (
                            <div key={story.id} style={{
                                background: 'white',
                                padding: '25px',
                                border: '1px solid #3E2723',
                                boxShadow: '5px 5px 0px #3E2723',
                                marginBottom: '30px',
                                position: 'relative'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <Link to={`/read/${story.id}`} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3E2723', textDecoration: 'none' }}>
                                            {story.title}
                                            {story.status === 'draft' && <span style={{ color: 'red', fontSize: '0.8rem', marginLeft: '10px' }}>[DRAFT]</span>}
                                        </Link>
                                        <p style={{ margin: '5px 0' }}>By <strong>{story.author}</strong></p>
                                    </div>

                                    {/* STATUS & CHAPTER COUNT */}
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            Chapters: {chapterCount}/{expected}
                                        </div>
                                        <div style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            color: story.is_complete ? '#2e7d32' : '#ed6c02',
                                            textTransform: 'uppercase',
                                            marginTop: '4px'
                                        }}>
                                            {story.is_complete ? '● Completed' : '○ On-going'}
                                        </div>
                                    </div>
                                </div>

                                <p style={{ color: '#5D4037', fontWeight: 'bold', fontSize: '0.85rem', margin: '10px 0' }}>
                                    {story.fandoms}
                                </p>

                                {story.summary && (
                                    <blockquote style={{ fontSize: '0.9rem', borderLeft: '3px solid #3E2723', paddingLeft: '15px', margin: '15px 0', fontStyle: 'italic', color: '#444' }}>
                                        {story.summary}
                                    </blockquote>
                                ) || <div style={{ height: '10px' }}></div>}

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#777' }}>
                                        Updated: {new Date(story.created_at).toLocaleDateString()}
                                    </span>
                                    <Link to={`/read/${story.id}`} style={{ fontWeight: 'bold', color: '#3E2723' }}>READ STORY →</Link>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', border: '2px dashed #ccc' }}>
                        <p>No stories found in the vault.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
