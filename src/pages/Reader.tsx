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
        const fetchFullStory = async () => {
            const { data: sData } = await supabase.from('stories').select('*').eq('id', id).single();
            const { data: cData } = await supabase.from('chapters').select('*').eq('story_id', id).order('chapter_number', { ascending: true });

            if (sData) setStory(sData);
            if (cData) setChapters(cData);
            setLoading(false);
        };
        fetchFullStory();
    }, [id]);

    const addBookmark = async () => {
        if (!user || user.id === 'guest') return alert("Guests cannot bookmark. Please log in.");
        const { error } = await supabase.from('bookmarks').insert([{ user_id: user.id, story_id: id }]);
        if (error) alert("Already pinned to your bookmarks!");
        else alert("🔖 Story added to your personal vault!");
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Decrypting records...</div>;
    if (!chapters.length) return <div style={{ padding: '50px', textAlign: 'center' }}>No content found.</div>;

    const currentChapter = chapters[currentIdx];

    return (
        <div style={{ background: '#F2B29A', minHeight: '100vh', padding: '20px' }}>
            <div style={{ maxWidth: '900px', margin: 'auto', background: 'white', padding: '40px', borderRadius: '8px', textAlign: 'left', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <Link to="/archive" style={{ color: '#3E2723', fontWeight: 'bold', textDecoration: 'none' }}>← BACK TO ARCHIVE</Link>
                    <button onClick={addBookmark} style={{ background: '#3E2723', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', fontWeight: 'bold' }}>
                        🔖 BOOKMARK STORY
                    </button>
                </div>

                <header style={{ borderBottom: '2px solid #3E2723', marginBottom: '30px', paddingBottom: '10px' }}>
                    <h1 style={{ fontFamily: 'serif', margin: 0, fontSize: '2.5rem' }}>{story?.title}</h1>
                    <p style={{ fontSize: '1.1rem' }}>By <strong>{story?.author}</strong></p>
                </header>

                <section>
                    <h2 style={{ textAlign: 'center', fontFamily: 'serif', color: '#5D4037', borderBottom: '1px double #eee', paddingBottom: '15px' }}>
                        Chapter {currentChapter.chapter_number}: {currentChapter.title}
                    </h2>
                    {/* 🌟 DangerouslySetInnerHTML allows the Rich Text/HTML from your editor to show up correctly */}
                    <div
                        style={{ lineHeight: '1.8', fontSize: '1.15rem', fontFamily: 'Georgia, serif', marginTop: '30px' }}
                        dangerouslySetInnerHTML={{ __html: currentChapter.content }}
                    />
                </section>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <button
                        disabled={currentIdx === 0}
                        onClick={() => { setCurrentIdx(currentIdx - 1); window.scrollTo(0, 0); }}
                        style={navBtn}
                    >
                        ← PREVIOUS
                    </button>
                    <button
                        disabled={currentIdx === chapters.length - 1}
                        onClick={() => { setCurrentIdx(currentIdx + 1); window.scrollTo(0, 0); }}
                        style={navBtn}
                    >
                        NEXT CHAPTER →
                    </button>
                </div>
            </div>
        </div>
    );
}

const navBtn = { padding: '10px 25px', cursor: 'pointer', background: '#eee', border: '1px solid #3E2723', fontWeight: 'bold' };
