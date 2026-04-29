import { useState } from 'react';
import { supabase } from '../supabase';

export default function Gatekeeper({ setUser }: any) {
    const [isLogin, setIsLogin] = useState(true);
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pseudo, setPseudo] = useState('');

    const handleAuth = async () => {
        if (isLogin) {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) return alert("Access Denied: Invalid Credentials");
            setUser({ ...data.user, pseudo: data.user?.user_metadata?.pseudo });
        } else {
            const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { pseudo } } });
            if (error) return alert(error.message);
            alert("Verification email sent!");
        }
    };

    const enterAsGuest = async () => {
        const { data } = await supabase.from('vault_access').select('*').eq('otp_code', otp).eq('is_used', false).single();
        if (data) setUser({ id: 'guest', pseudo: 'Guest Visitor', isAdmin: false });
        else alert("🔒 Invalid or expired OTP.");
    };

    return (
        <div style={{ background: '#F2B29A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: '40px', border: '2px solid #3E2723', width: '350px', boxShadow: '10px 10px 0 #3E2723' }}>
                <h2 style={{ fontFamily: 'serif' }}>{isLogin ? 'MEMBER LOGIN' : 'CREATE ID'}</h2>
                {!isLogin && <input placeholder="Pseudo" onChange={e => setPseudo(e.target.value)} style={inputStyle} />}
                <input placeholder="Email" onChange={e => setEmail(e.target.value)} style={inputStyle} />
                <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={inputStyle} />
                <button onClick={handleAuth} style={btnStyle}>{isLogin ? 'ENTER' : 'REGISTER'}</button>
                <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', fontSize: '0.7rem', marginTop: '10px' }}>
                    {isLogin ? "New here? Register Account" : "Return to Login"}
                </p>
                <div style={{ borderTop: '1px solid #ddd', marginTop: '20px', paddingTop: '20px' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>GUEST ENTRY (OTP)</p>
                    <input placeholder="6-Digit Code" onChange={e => setOtp(e.target.value)} style={inputStyle} />
                    <button onClick={enterAsGuest} style={{ ...btnStyle, background: '#5D4037' }}>ACCESS AS GUEST</button>
                </div>
            </div>
        </div>
    );
}

const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #3E2723' };
const btnStyle = { width: '100%', padding: '10px', background: '#3E2723', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' };
