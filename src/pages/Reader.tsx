import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Reader() {
    const { id } = useParams();
    const [chapters, setChapters] = useState<any[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const { data } = await supabase.from('chapters').select('*').eq('story_id', id).order('chapter_number', { ascending: true });
            if (data) setChapters(data);
            setLoading(false);
        };
        fetch();
    }, [id]);

    // 🌟 AUTO-IMAGE RENDERER: Turns links ending in .gif, .jpg, .png into actual images
    const renderMedia = (content: string) => {
        const regex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/gi;
        return content.replace(regex, (url) => `<img src="${url}" style="max-width:100%; height:auto; display:block; margin:20px auto;" />`);
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Decrypting...</div>;
    const ch = chapters[currentIdx];

    return (
        <div style={{ background: '#F2B29A', minHeight: '100vh', padding: '20px' }}>
            <div style={{ maxWidth: '850px', margin: 'auto', background: 'white', padding: '40px', borderRadius: '8px', textAlign: 'left' }}>
                <Link to="/archive" style={{ color: '#3E2723', fontWeight: 'bold' }}>← ARCHIVE</Link>
                {ch && (
                    <div style={{ marginTop: '30px' }}>
                        <h2 style={{ textAlign: 'center', fontFamily: 'serif' }}>Chapter {ch.chapter_number}</h2>
                        <div
                            style={{ lineHeight: '1.8', fontSize: '1.15rem', fontFamily: 'Georgia, serif' }}
                            dangerouslySetInnerHTML={{ __html: renderMedia(ch.content) }}
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
