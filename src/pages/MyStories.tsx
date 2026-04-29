import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';
import StoryCard from '../components/StoryCard';

export default function MyStories({ user }: any) {
    const [bookmarks, setBookmarks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!user || user.id === 'guest') {
                setLoading(false);
                return;
            }

            // 🧠 Logic: Fetch bookmark records and join with the stories and chapters table
            const { data, error } = await supabase
                .from('bookmarks')
                .select(`
                    story_id,
                    stories (
                        *,
                        chapters (id)
                    )
                `)
                .eq('user_id', user.id);

            if (!error && data) {
                // Flatten the data to get an array of stories
                const storyList = data.map((b: any) => b.stories);
                setBookmarks(storyList);
            }
            setLoading(false);
        };

        fetchBookmarks();
    }, [user]);

    const removeBookmark = async (storyId: string) => {
        if (window.confirm("Remove this story from your bookmarks?")) {
            const { error } = await supabase
                .from('bookmarks')
                .delete()
                .eq('user_id', user.id)
                .eq('story_id', storyId);

            if (!error) {
                setBookmarks(bookmarks.filter(b => b.id !== storyId));
            }
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px', textAlign: 'left', minHeight: '100vh' }}>
            <header style={{ borderBottom: '4px solid #3E2723', marginBottom: '40px', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ color: '#3E2723', fontFamily: 'serif', fontSize: '2.5rem', margin: 0 }}>MY BOOKMARKS</h1>
                    <Link to="/archive" style={{ fontWeight: 'bold', color: '#3E2723', textDecoration: 'none', border: '1px solid #3E2723', padding: '5px 15px' }}>
                        ← BACK TO ARCHIVE
                    </Link>
                </div>
                <p style={{ marginTop: '10px', color: '#666' }}>
                    Viewing saved records for: <strong>{user?.pseudo || 'Citizen'}</strong>
                </p>
            </header>

            <div className="bookmarks-list">
                {loading ? (
                    <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Retrieving pinned files...</p>
                ) : user?.id === 'guest' ? (
                    <div style={{ padding: '40px', textAlign: 'center', background: '#eee' }}>
                        <p><strong>Guest Access:</strong> Bookmarking is restricted to registered members.</p>
                        <Link to="/entry" style={{ color: '#3E2723', fontWeight: 'bold' }}>Create an account to save stories.</Link>
                    </div>
                ) : bookmarks.length > 0 ? (
                    bookmarks.map((story) => (
                        <div key={story.id} style={{ position: 'relative' }}>
                            {/* Reuse the StoryCard for consistent look */}
                            <StoryCard story={story} />

                            {/* Simple "Remove" button overlay/next to card */}
                            <button
                                onClick={() => removeBookmark(story.id)}
                                style={{
                                    position: 'absolute',
                                    top: '25px',
                                    right: '120px',
                                    background: 'none',
                                    border: 'none',
                                    color: '#999',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    textDecoration: 'underline'
                                }}
                            >
                                [Remove Bookmark]
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={{ padding: '60px', textAlign: 'center', border: '2px dashed #ccc' }}>
                        <p>You haven't pinned any stories to your vault yet.</p>
                        <Link to="/archive" style={{ color: '#3E2723', fontWeight: 'bold' }}>Browse the Archive</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
