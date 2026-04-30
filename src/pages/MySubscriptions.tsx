import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';

export default function MySubscriptions({ user }: any) {
    const [subs, setSubs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSubs = async () => {
        if (!user || user.id === 'guest') return;

        const { data, error } = await supabase
            .from('subscriptions')
            .select(`id, story_id, stories (title, author)`)
            .eq('user_id', user.id);

        if (!error && data) setSubs(data);
        setLoading(false);
    };

    useEffect(() => { fetchSubs(); }, [user]);

    const unsubscribe = async (subId: string) => {
        if (window.confirm("Stop receiving email alerts for this story?")) {
            const { error } = await supabase.from('subscriptions').delete().eq('id', subId);
            if (!error) setSubs(subs.filter(s => s.id !== subId));
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px', textAlign: 'left', minHeight: '100vh' }}>
            <header style={{ borderBottom: '4px solid #3E2723', marginBottom: '40px', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ color: '#3E2723', fontFamily: 'serif', fontSize: '2.5rem', margin: 0 }}>MY SUBSCRIPTIONS</h1>
                    <Link to="/archive" style={{ fontWeight: 'bold', color: '#3E2723', textDecoration: 'none', border: '1px solid #3E2723', padding: '5px 15px' }}>
                        ← BACK
                    </Link>
                </div>
            </header>

            {loading ? (
                <p>Loading your alerts...</p>
            ) : subs.length > 0 ? (
                subs.map((sub) => (
                    <div key={sub.id} style={{
                        background: 'white',
                        padding: '20px',
                        border: '1px solid #3E2723',
                        marginBottom: '15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '4px 4px 0px #3E2723'
                    }}>
                        <div>
                            <Link to={`/read/${sub.story_id}`} style={{ fontWeight: 'bold', color: '#3E2723', fontSize: '1.2rem', textDecoration: 'none' }}>
                                {sub.stories?.title}
                            </Link>
                            <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>By {sub.stories?.author}</p>
                        </div>
                        <button
                            onClick={() => unsubscribe(sub.id)}
                            style={{ background: 'none', border: '1px solid #999', color: '#999', cursor: 'pointer', padding: '5px 10px', fontSize: '0.8rem' }}
                        >
                            UNSUBSCRIBE
                        </button>
                    </div>
                ))
            ) : (
                <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed #ccc' }}>
                    <p>You aren't subscribed to any stories yet.</p>
                </div>
            )}
        </div>
    );
}
