import { useState } from 'react';
import { supabase } from '../supabase';

export default function Gatekeeper({ setUser }: any) {
    const [id, setId] = useState('');
    const [pass, setPass] = useState('');
    const [otp, setOtp] = useState('');

    const handleAdmin = () => {
        if (id === 'Babysterek' && pass === 'ammuisfine') {
            setUser({ id: 'admin_1', pseudo: 'Babysterek', isAdmin: true });
        } else { alert("🔒 Credentials Invalid"); }
    };

    const handleGuest = async () => {
        const { data } = await supabase.from('vault_access').select('*').eq('otp_code', otp).single();
        if (data) setUser({ id: 'guest', pseudo: 'Vault Visitor', isAdmin: false });
        else alert("🔒 Invalid OTP");
    };

    return (
        <div style={{ background: '#F2B29A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: '40px', border: '2px solid #3E2723', width: '350px', boxShadow: '10px 10px 0 #3E2723' }}>
                <h2 style={{ fontFamily: 'serif' }}>FICVAULT ACCESS</h2>
                <div style={{ marginBottom: '30px' }}>
                    <input placeholder="USER ID" onChange={e => setId(e.target.value)} style={inputStyle} />
                    <input type="password" placeholder="PASSWORD" onChange={e => setPass(e.target.value)} style={inputStyle} />
                    <button onClick={handleAdmin} style={btnStyle}>ADMIN LOGIN</button>
                </div>
                <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>GUEST OTP</p>
                    <input placeholder="Enter Code..." onChange={e => setOtp(e.target.value)} style={inputStyle} />
                    <button onClick={handleGuest} style={{ ...btnStyle, background: '#5D4037' }}>GUEST ENTRY</button>
                </div>
            </div>
        </div>
    );
}
const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #3E2723' };
const btnStyle = { width: '100%', padding: '10px', background: '#3E2723', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' };
