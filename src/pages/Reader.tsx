import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import Comments from '../components/Comments'; // 🌟 1. IMPORT COMMENTS

export default function Reader({ user }: any) {
    const { id } = useParams();
    const [story, setStory] = useState<any>(null);
    const [chapters, setChapters] = useState<any[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFullStory = async () => {
            // 1. Fetch Story Details
            const { data: sData } = await supabase.from('stories').select('*').eq('id', id).single();

            // 2. Fetch ONLY Published Chapters
            const { data: cData } = await supabase.from('chapters')
                .select('*')
                .eq('story_id', id)
                .eq('is_published', true)
                .order('chapter_number', { ascending: true });

            if (sData) setStory(sData);
            if (cData) setChapters(cData);
            setLoading(false);
        };
        fetchFullStory();
    }, [id]);

    // 🔖 Bookmark Logic
    const addBookmark = async () => {
        if (!user || user.id === 'guest') return alert("🔒 Please sign in to bookmark stories.");
        const { error } = await supabase.from('bookmarks').insert([{ user_id: user.id, story_id: id }]);
        if (error) alert("Already in your bookmarks!");
        else alert("🔖 Added to Pinned Records!");
    };

    // 📩 Subscribe Logic
    const subscribeToStory = async () => {
        if (!user || user.id === 'guest' || !user.email || user.email.includes('@vault.local')) {
            return alert("📧 Email required. Please sign in with a verified email to receive update alerts.");
        }
        const { error } = await supabase.from('subscriptions').insert([{ user_id: user.id, story_id: id, user_email: user.email }]);
        if (error) alert("You are already subscribed!");
        else alert("📬 Subscribed! You will get alerts for new chapters.");
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Decrypting records...</div>;

    if (!chapters.length) return (
        <div style={{ padding: '50px', textAlign: 'center', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '40px', maxWidth: '600px', margin: 'auto', border: '2px solid #3E2723' }}>
                <h2>{story?.title}</h2>
                <p>This work is currently in <strong>Draft Status</strong>.</p>
                <Link to="/archive" style={{ color: '#3E2723', fontWeight: 'bold' }}>← BACK TO ARCHIVE</Link>
            </div>
        </div>
    );

    const ch = chapters[currentIdx];

    return (
        <div style={{ background: '#F2B29A', minHeight: '100vh', padding: '20px' }}>

            {story?.work_skin && (
                <style dangerouslySetInnerHTML={{ __html: story.work_skin }} />
            )}

            <div style={{ maxWidth: '850px', margin: 'auto', background: 'white', padding: '40px', borderRadius: '8px', textAlign: 'left', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <Link to="/archive" style={{ color: '#3E2723', fontWeight: 'bold', textDecoration: 'none' }}>← BACK</Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#3E2723' }}>INDEX:</label>
                        <select
                            value={currentIdx}
                            onChange={(e) => {
                                setCurrentIdx(parseInt(e.target.value));
                                window.scrollTo(0, 0);
                            }}
                            style={{ padding: '5px 10px', border: '1px solid #3E2723', background: 'white', fontFamily: 'serif', cursor: 'pointer' }}
                        >
                            {chapters.map((chapter, index) => (
                                <option key={chapter.id} value={index}>
                                    Chapter {chapter.chapter_number}: {chapter.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 🛠️ Interaction Buttons */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={addBookmark} style={btnSmall}>🔖 BOOKMARK</button>
                        <button onClick={subscribeToStory} style={btnSmall}>📩 SUBSCRIBE</button>
                    </div>
                </div>

                <header style={{ borderBottom: '2px solid #3E2723', marginBottom: '30px', paddingBottom: '10px' }}>
                    <h1 style={{ fontFamily: 'serif', margin: 0, fontSize: '2.5rem' }}>{story?.title}</h1>
                    <p style={{ fontSize: '1.1rem' }}>By <strong>{story?.author || 'Babysterek'}</strong></p>
                </header>

                <section id="workskin">
                    <h2 style={{ textAlign: 'center', fontFamily: 'serif', color: '#5D4037' }}>
                        Chapter {ch.chapter_number}: {ch.title}
                    </h2>

                    <div
                        style={{ lineHeight: '1.8', fontSize: '1.15rem', fontFamily: 'Georgia, serif', marginTop: '30px' }}
                        dangerouslySetInnerHTML={{
                            __html: ch.content.replace(
                                /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/gi,
                                '<img src="$1" style="max-width:100%; height:auto; display:block; margin: 20px auto;" />'
                            )
                        }}
                    />
                </section>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <button
                        disabled={currentIdx === 0}
                        onClick={() => { setCurrentIdx(currentIdx - 1); window.scrollTo(0, 0); }}
                        style={btnNav}
                    >
                        ← PREVIOUS
                    </button>
                    <button
                        disabled={currentIdx === chapters.length - 1}
                        onClick={() => { setCurrentIdx(currentIdx + 1); window.scrollTo(0, 0); }}
                        style={btnNav}
                    >
                        NEXT CHAPTER →
                    </button>
                </div>

                <Comments
                    storyId={id}
                    chapterId={ch.id}
                    user={user}
                    commentsEnabled={story?.comments_enabled}
                />

            </div>
        </div>
    );
}

const btnNav = { padding: '10px 25px', cursor: 'pointer', background: '#eee', border: '1px solid #3E2723', fontWeight: 'bold' as 'bold' };
const btnSmall = { padding: '5px 10px', fontSize: '0.75rem', cursor: 'pointer', background: 'white', border: '1px solid #3E2723', fontWeight: 'bold' as 'bold', color: '#3E2723' };
