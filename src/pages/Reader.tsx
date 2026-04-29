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
        const fetchFullStory = async () => {
            const { data: sData } = await supabase.from('stories').select('*').eq('id', id).single();
            const { data: cData } = await supabase.from('chapters').select('*').eq('story_id', id).order('chapter_number', { ascending: true });
            if (sData) setStory(sData);
            if (cData) setChapters(cData);
            setLoading(false);
        };
        fetchFullStory();
    }, [id]);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Decrypting...</div>;
    const currentChapter = chapters[currentIdx];

    // 🌟 THE MAGIC IMAGE FIX: This function finds links and makes them <img> tags
    const renderContent = (content: string) => {
        const imageRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/gi;
        return content.replace(imageRegex, (url) => `<img src="${url}" style="max-width:100%; height:auto; display:block; margin: 20px auto;" />`);
    };

    return (
        <div style={{ background: '#F2B29A', minHeight: '100vh', padding: '20px' }}>
            <div style={{ maxWidth: '900px', margin: 'auto', background: 'white', padding: '40px', borderRadius: '8px', textAlign: 'left' }}>
                <Link to="/archive" style={{ color: '#3E2723', fontWeight: 'bold', textDecoration: 'none' }}>← ARCHIVE</Link>

                <header style={{ borderBottom: '2px solid #3E2723', margin: '20px 0', paddingBottom: '10px' }}>
                    <h1 style={{ fontFamily: 'serif', margin: 0 }}>{story?.title}</h1>
                    <p>By {story?.author}</p>
                </header>

                {currentChapter && (
                    <section>
                        <h2 style={{ textAlign: 'center', fontFamily: 'serif', color: '#5D4037' }}>{currentChapter.title}</h2>
                        <div
                            style={{ lineHeight: '1.8', fontSize: '1.1rem', fontFamily: 'Georgia, serif', marginTop: '30px' }}
                            dangerouslySetInnerHTML={{ __html: renderContent(currentChapter.content) }}
                        />
                    </section>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '50px' }}>
                    <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(currentIdx - 1)}>← PREV</button>
                    <button disabled={currentIdx === chapters.length - 1} onClick={() => setCurrentIdx(currentIdx + 1)}>NEXT →</button>
                </div>
            </div>
        </div>
    );
}
