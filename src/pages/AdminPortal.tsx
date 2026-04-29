import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';

export default function AdminPortal() {
    const [otp, setOtp] = useState('');
    const [stats, setStats] = useState({ stories: 0, chapters: 0, bookmarks: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            const { count: sCount } = await supabase.from('stories').select('*', { count: 'exact', head: true });
            const { count: cCount } = await supabase.from('chapters').select('*', { count: 'exact', head: true });
            const { count: bCount } = await supabase.from('bookmarks').select('*', { count: 'exact', head: true });
            setStats({ stories: sCount || 0, chapters: cCount || 0, bookmarks: bCount || 0 });
        };
        fetchStats();
    }, []);

    const generateOTP = async () => {
        setLoading(true);
        // Generates a random 6-character code
        const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const { error } = await supabase.from('vault_access').insert([{ otp_code: newCode }]);

        if (!error) {
            setOtp(newCode);
            alert(`New Guest Code Generated: ${newCode}`);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '40px', maxWidth: '800px', margin: 'auto', border: '2px solid #3E2723', boxShadow: '10px 10px 0 #3E2723', textAlign: 'left' }}>
                <h1 style={{ fontFamily: 'serif', borderBottom: '3px solid #3E2723', paddingBottom: '10px' }}>ADMIN COMMAND CENTER</h1>

                {/* 📊 VAULT STATS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', margin: '30px 0' }}>
                    <div style={statBox}><strong>{stats.stories}</strong><br />Works</div>
                    <div style={statBox}><strong>{stats.chapters}</strong><br />Chapters</div>
                    <div style={statBox}><strong>{stats.bookmarks}</strong><br />Bookmarks</div>
                </div>

                {/* 🔑 OTP GENERATOR */}
                <div style={{ background: '#eee', padding: '20px', marginBottom: '30px', border: '1px solid #ccc' }}>
                    <h3 style={{ margin: 0 }}>GUEST ACCESS MANAGEMENT</h3>
                    <p style={{ fontSize: '0.8rem' }}>Generate a temporary code to invite a guest to the vault.</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button onClick={generateOTP} disabled={loading} style={btnStyle}>GENERATE NEW OTP</button>
                        {otp && <div style={{ background: '#3E2723', color: 'white', padding: '10px 20px', fontWeight: 'bold' }}>{otp}</div>}
                    </div>
                </div>

                {/* 🚀 QUICK LINKS */}
                <div style={{ display: 'grid', gap: '10px' }}>
                    <h3 style={{ margin: 0 }}>VAULT CONTROLS</h3>
                    <Link to="/post-work" style={linkStyle}>+ Manual Story Post</Link>
                    <Link to="/post-word" style={linkStyle}>📥 Bulk Word Import (.docx)</Link>
                    <Link to="/post-epub" style={linkStyle}>📔 Bulk EPUB Import</Link>
                    <Link to="/manage-stories" style={linkStyle}>⚙️ Edit/Delete Content</Link>
                    <Link to="/archive" style={{ ...linkStyle, background: '#ccc', color: 'black' }}>← Return to Archive</Link>
                </div>
            </div>
        </div>
    );
}

const statBox = { background: '#f9f9f9', padding: '20px', textAlign: 'center' as 'center', border: '1px solid #ddd' };
const btnStyle = { background: '#3E2723', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' };
const linkStyle = { display: 'block', padding: '15px', background: '#3E2723', color: 'white', textDecoration: 'none', fontWeight: 'bold', textAlign: 'center' as 'center' };
