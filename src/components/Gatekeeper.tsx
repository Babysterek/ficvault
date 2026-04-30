import { useState } from 'react';
import { supabase } from '../supabase';

export default function Gatekeeper({ setUser }: any) {
    const [isLogin, setIsLogin] = useState(true);
    const [id, setId] = useState('');
    const [pass, setPass] = useState('');
    const [otp, setOtp] = useState('');

    const handleAuth = async () => {
        // 🕵️ 1. ADMIN CHECK (Babysterek)
        if (id === 'Babysterek' && pass === 'ammuisfine') {
            setUser({ id: 'admin_1', pseudo: 'Babysterek', isAdmin: true });
            return;
        }

        // 🆔 2. CITIZEN AUTH (Hidden Email logic)
        // 🛠️ FIX: Added .replace to remove spaces/special chars that cause "Database Error"
        const cleanId = id.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        const fakeEmail = `${cleanId}@vault.local`;

        if (isLogin) {
            // Login existing user
            const { data, error } = await supabase.auth.signInWithPassword({
                email: fakeEmail,
                password: pass
            });
            if (error) return alert("🔒 Vault Access Denied: Check ID/Pass");
            setUser({ ...data.user, pseudo: id, isAdmin: false });
        } else {
            // Register new user
            const { error } = await supabase.auth.signUp({
                email: fakeEmail,
                password: pass
            });

            if (error) {
                return alert("Database Error: " + error.message);
            }

            alert("✨ Citizen ID Created! You can now login.");
            setIsLogin(true);
        }
    };

    const handleGuest = async () => {
        // 🔑 3. GUEST CHECK (halefire)
        const { data } = await supabase.from('vault_access').select('*').eq('otp_code', otp).single();
        if (data) {
            setUser({ id: 'guest', pseudo: 'Visitor', isAdmin: false });
        } else {
            alert("🔒 Invalid OTP");
        }
    };

    return (
        <div style={{ background: '#F2B29A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: '40px', border: '2px solid #3E2723', width: '350px', boxShadow: '10px 10px 0 #3E2723' }}>
                <h2 style={{ fontFamily: 'serif', textAlign: 'center' }}>
                    {isLogin ? 'VAULT ACCESS' : 'CREATE CITIZEN ID'}
                </h2>

                {/* MEMBER & ADMIN SECTION */}
                <div style={{ marginBottom: '20px' }}>
                    <input
                        placeholder="USER ID"
                        onChange={e => setId(e.target.value)}
                        style={inputStyle}
                    />
                    <input
                        type="password"
                        placeholder="PASSWORD"
                        onChange={e => setPass(e.target.value)}
                        style={inputStyle}
                    />
                    <button onClick={handleAuth} style={btnStyle}>
                        {isLogin ? 'ENTER VAULT' : 'REGISTER ID'}
                    </button>

                    <p onClick={() => setIsLogin(!isLogin)} style={toggleText}>
                        {isLogin ? "Need a permanent ID? Register here." : "Return to Login"}
                    </p>
                </div>

                <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold', textAlign: 'center' }}>GUEST OTP</p>
                    <input
                        placeholder="Enter Code..."
                        onChange={e => setOtp(e.target.value)}
                        style={inputStyle}
                    />
                    <button onClick={handleGuest} style={{ ...btnStyle, background: '#5D4037' }}>
                        GUEST ENTRY
                    </button>
                </div>
            </div>
        </div>
    );
}

const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #3E2723', boxSizing: 'border-box' as 'border-box' };
const btnStyle = { width: '100%', padding: '12px', background: '#3E2723', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' as 'bold' };
const toggleText = { fontSize: '0.7rem', cursor: 'pointer', marginTop: '10px', textDecoration: 'underline', textAlign: 'center' as 'center' };
