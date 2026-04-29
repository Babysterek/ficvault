import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Reader() {
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

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Opening Records...</div>;
    if (!chapters.length) return <div style={{ padding: '50px', textAlign: 'center' }}>No content found.</div>;

    const chapter = chapters[currentIdx];

    return (
        <div style={{ background: '#F2B29A', minHeight: '100vh', padding: '20px' }}>
            <div style={{ maxWidth: '850px', margin: 'auto', background: 'white', padding: '40px', borderRadius: '8px', textAlign: 'left', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <Link to="/archive" style={{ color: '#3E2723', fontWeight: 'bold', textDecoration: 'none' }}>← BACK TO ARCHIVE</Link>
                <h1 style={{ fontFamily: 'serif', margin: '20px 0 5px 0' }}>{story?.title}</h1>
                <p style={{ borderBottom: '2px solid #3E2723', paddingBottom: '10px' }}>By {story?.author}</p>

                <div style={{ marginTop: '40px' }}>
                    <h2 style={{ textAlign: 'center', fontFamily: 'serif' }}>Chapter {chapter.chapter_number}: {chapter.title}</h2>
                    <div
                        style={{ lineHeight: '1.8', fontSize: '1.15rem', fontFamily: 'Georgia, serif', marginTop: '30px' }}
                        dangerouslySetInnerHTML={{ __html: chapter.content }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(currentIdx - 1)} style={{ padding: '10px 20px' }}>← PREV</button>
                    <button disabled={currentIdx === chapters.length - 1} onClick={() => setCurrentIdx(currentIdx + 1)} style={{ padding: '10px 20px' }}>NEXT →</button>
                </div>
            </div>
        </div>
    );
}
