import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Reader({ user }: any) {
    const { id } = useParams();
    const [story, setStory] = useState<any>(null);
    const [chapters, setChapters] = useState<any[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data: sData } = await supabase.from('stories').select('*').eq('id', id).single();
            const { data: cData } = await supabase.from('chapters').select('*').eq('story_id', id).order('chapter_number', { ascending: true });
            if (sData) setStory(sData);
            if (cData) setChapters(cData);
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const addBookmark = async () => {
        const { error } = await supabase.from('bookmarks').insert([{ user_id: user.id, story_id: id }]);
        alert(error ? "Already bookmarked!" : "Added to Bookmarks!");
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
    const chapter = chapters[currentIdx];

    return (
        <div style={{ background: '#F2B29A', minHeight: '100vh', padding: '20px' }}>
            <div style={{ maxWidth: '800px', margin: 'auto', background: 'white', padding: '40px', textAlign: 'left', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Link to="/archive" style={{ fontWeight: 'bold', color: '#3E2723' }}>← ARCHIVE</Link>
                    <button onClick={addBookmark} style={{ background: '#3E2723', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>🔖 BOOKMARK</button>
                </div>

                <h1 style={{ fontFamily: 'serif', marginTop: '20px' }}>{story?.title}</h1>
                <p style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>By {story?.author}</p>

                {chapter && (
                    <div style={{ marginTop: '30px' }}>
                        <h2 style={{ textAlign: 'center', fontFamily: 'serif' }}>{chapter.title}</h2>
                        <div style={{ lineHeight: '1.8', fontSize: '1.1rem', marginTop: '20px' }} dangerouslySetInnerHTML={{ __html: chapter.content }} />
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
                    <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(currentIdx - 1)}>← PREV</button>
                    <button disabled={currentIdx === chapters.length - 1} onClick={() => setCurrentIdx(currentIdx + 1)}>NEXT →</button>
                </div>
            </div>
        </div>
    );
}
