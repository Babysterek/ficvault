import { useState } from 'react';
import { supabase } from '../supabase';

export default function Gatekeeper({ setUser }: any) {
    const [id, setId] = useState('');
    const [pass, setPass] = useState('');
    const [otp, setOtp] = useState('');

    const handleAdmin = () => {
        if (id === 'Babysterek' && pass === 'ammuisfine') {
            setUser({ id: 'admin_1', pseudo: 'Babysterek', isAdmin: true });
        } else { alert("🔒 Access Denied"); }
    };

    const handleGuest = async () => {
        const { data } = await supabase.from('vault_access').select('*').eq('otp_code', otp).single();
        if (data) setUser({ id: 'guest', pseudo: 'Visitor', isAdmin: false });
        else alert("🔒 Invalid OTP");
    };

    return (
        <div style={{ background: '#F2B29A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: '40px', border: '2px solid #3E2723', width: '350px' }}>
                <input placeholder="ID" onChange={e => setId(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
                <input type="password" placeholder="PASS" onChange={e => setPass(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
                <button onClick={handleAdmin} style={{ width: '100%', background: '#3E2723', color: 'white' }}>ADMIN LOGIN</button>
                <hr />
                <input placeholder="GUEST OTP" onChange={e => setOtp(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
                <button onClick={handleGuest} style={{ width: '100%' }}>GUEST ENTRY</button>
            </div>
        </div>
    );
}
