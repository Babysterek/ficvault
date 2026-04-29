import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Reader({ user }: any) {
    const { id } = useParams();
    const [story, setStory] = useState<any>(null);
    const [chapters, setChapters] = useState<any[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [comment, setComment] = useState('');
    const [allComments, setAllComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFullStory = async () => {
            const { data: sData } = await supabase.from('stories').select('*').eq('id', id).single();
            const { data: cData } = await supabase.from('chapters').select('*').eq('story_id', id).order('chapter_number', { ascending: true });

            if (sData) setStory(sData);
            if (cData) setChapters(cData);

            // Fetch Comments
            const { data: coms } = await supabase.from('comments').select('*').eq('story_id', id).order('created_at', { ascending: false });
            if (coms) setAllComments(coms);

            setLoading(false);
        };
        fetchFullStory();
    }, [id]);

    const postComment = async () => {
        if (!comment) return;
        const { error } = await supabase.from('comments').insert([{
            story_id: id,
            chapter_id: chapters[currentIdx]?.id,
            user_name: user?.pseudo || 'Anonymous',
            content: comment
        }]);
        if (!error) {
            setAllComments([{ user_name: user?.pseudo || 'Anonymous', content: comment, created_at: new Date() }, ...allComments]);
            setComment('');
        }
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Decrypting...</div>;
    if (!story || chapters.length === 0) return <div style={{ padding: '50px', textAlign: 'center' }}>File not found.</div>;

    const currentChapter = chapters[currentIdx];

    return (
        <div style={{ background: '#F2B29A', minHeight: '100vh', padding: '20px' }}>
            <div style={{ maxWidth: '900px', margin: 'auto', background: 'white', padding: '40px', borderRadius: '8px', textAlign: 'left' }}>

                {/* 🧭 TOP NAVIGATION */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.9rem' }}>
                    <Link to="/archive" style={{ color: '#3E2723', fontWeight: 'bold' }}>← ARCHIVE</Link>
                    <button style={{ background: '#3E2723', color: 'white', border: 'none', padding: '5px 15px', cursor: 'pointer' }}>❤ BOOKMARK</button>
                </div>

                <header style={{ borderBottom: '2px solid #3E2723', marginBottom: '30px', paddingBottom: '10px' }}>
                    <h1 style={{ fontFamily: 'serif', margin: 0 }}>{story.title}</h1>
                    <p>By {story.author}</p>
                </header>

                {/* 📖 CHAPTER CONTENT */}
                <section>
                    <h2 style={{ textAlign: 'center', fontFamily: 'serif', color: '#5D4037' }}>
                        Chapter {currentChapter.chapter_number}: {currentChapter.title}
                    </h2>
                    <div
                        style={{ lineHeight: '1.8', fontSize: '1.1rem', fontFamily: 'Georgia, serif', marginTop: '30px' }}
                        dangerouslySetInnerHTML={{ __html: currentChapter.content }}
                    />
                </section>

                {/* ⏭️ BOTTOM NAVIGATION */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(currentIdx - 1)} style={{ padding: '10px 20px', cursor: 'pointer' }}>← PREV</button>
                    <button disabled={currentIdx === chapters.length - 1} onClick={() => setCurrentIdx(currentIdx + 1)} style={{ padding: '10px 20px', cursor: 'pointer' }}>NEXT →</button>
                </div>

                {/* 💬 COMMENT SECTION */}
                <section style={{ marginTop: '60px', background: '#f9f9f9', padding: '20px' }}>
                    <h3 style={{ borderBottom: '1px solid #3E2723' }}>Comments</h3>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Leave a review..."
                        style={{ width: '100%', height: '80px', marginTop: '10px', padding: '10px' }}
                    />
                    <button onClick={postComment} style={{ marginTop: '10px', background: '#3E2723', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>POST COMMENT</button>

                    <div style={{ marginTop: '30px' }}>
                        {allComments.map((c, i) => (
                            <div key={i} style={{ borderBottom: '1px solid #ddd', padding: '15px 0' }}>
                                <strong>{c.user_name}</strong> <span style={{ fontSize: '0.7rem', color: '#999' }}>{new Date(c.created_at).toLocaleDateString()}</span>
                                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>{c.content}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
