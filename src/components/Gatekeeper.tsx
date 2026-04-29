import { useState } from 'react';
import { supabase } from '../supabase';

export default function Gatekeeper({ setUser }: any) {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [guestCode, setGuestCode] = useState('');

    const handleAdminAuth = () => {
        if (userId === 'Babysterek' && password === 'ammuisfine') {
            setUser({ id: 'admin_1', pseudo: 'Babysterek', isAdmin: true });
        } else {
            alert("🔒 Invalid Credentials");
        }
    };

    const enterAsGuest = async () => {
        const { data } = await supabase.from('vault_access').select('*').eq('otp_code', guestCode).single();
        if (data) {
            setUser({ id: 'guest', pseudo: 'Guest Visitor', isAdmin: false });
        } else {
            alert("🔒 Invalid Guest Password");
        }
    };

    return (
        <div style={{ background: '#F2B29A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: '40px', border: '2px solid #3E2723', width: '350px', boxShadow: '10px 10px 0 #3E2723' }}>
                <h2 style={{ fontFamily: 'serif' }}>VAULT ENTRY</h2>
                <div style={{ marginBottom: '30px' }}>
                    <input placeholder="USER ID" onChange={e => setUserId(e.target.value)} style={inputStyle} />
                    <input type="password" placeholder="PASSWORD" onChange={e => setPassword(e.target.value)} style={inputStyle} />
                    <button onClick={handleAdminAuth} style={btnStyle}>LOGIN</button>
                </div>
                <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>GUEST ACCESS</p>
                    <input placeholder="GUEST PASSWORD" onChange={e => setGuestCode(e.target.value)} style={inputStyle} />
                    <button onClick={enterAsGuest} style={{ ...btnStyle, background: '#5D4037' }}>ENTER</button>
                </div>
            </div>
        </div>
    );
}

const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #3E2723' };
const btnStyle = { width: '100%', padding: '10px', background: '#3E2723', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' };
