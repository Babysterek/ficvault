import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Reader() {
    const { id } = useParams();
    const [chapters, setChapters] = useState<any[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);

    useEffect(() => {
        const fetch = async () => {
            const { data } = await supabase.from('chapters')
                .select('*')
                .eq('story_id', id)
                .order('chapter_number', { ascending: true }); // 🌟 IMPORTANT
            if (data) setChapters(data);
        };
        fetch();
    }, [id]);

    const ch = chapters[currentIdx];

    return (
        <div style={{ background: '#F2B29A', minHeight: '100vh', padding: '20px' }}>
            <div style={{ maxWidth: '850px', margin: 'auto', background: 'white', padding: '40px' }}>
                <Link to="/archive">← BACK</Link>
                {ch && (
                    <div style={{ marginTop: '30px', textAlign: 'left' }}>
                        <h2 style={{ textAlign: 'center' }}>{ch.title}</h2>
                        <div
                            style={{ lineHeight: '1.8', fontSize: '1.1rem', fontFamily: 'serif' }}
                            dangerouslySetInnerHTML={{ __html: ch.content }}
                        />
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
