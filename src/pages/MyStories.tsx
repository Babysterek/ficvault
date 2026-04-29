import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';

export default function MyStories({ user }: any) {
    const [bookmarks, setBookmarks] = useState<any[]>([]);

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!user || user.id === 'guest') return;
            const { data } = await supabase.from('bookmarks').select('stories(*)').eq('user_id', user.id);
            if (data) setBookmarks(data.map(b => b.stories));
        };
        fetchBookmarks();
    }, [user]);

    const remove = async (storyId: string) => {
        await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('story_id', storyId);
        setBookmarks(bookmarks.filter(b => b.id !== storyId));
    };

    return (
        <div style={{ padding: '40px', textAlign: 'left', maxWidth: '900px', margin: 'auto' }}>
            <h2 style={{ borderBottom: '2px solid #3E2723' }}>MY PINNED RECORDS</h2>
            <Link to="/archive">← Back to Archive</Link>
            {bookmarks.length === 0 ? <p style={{ marginTop: '20px' }}>No bookmarks found.</p> : bookmarks.map(story => (
                <div key={story.id} style={{ padding: '20px', border: '1px solid #3E2723', marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <Link to={`/read/${story.id}`} style={{ fontWeight: 'bold', color: '#3E2723', fontSize: '1.2rem', textDecoration: 'none' }}>{story.title}</Link>
                    <button onClick={() => remove(story.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>REMOVE</button>
                </div>
            ))}
        </div>
    );
}
