import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Gatekeeper({ setUser }: any) {
    const [isLogin, setIsLogin] = useState(true);
    const [id, setId] = useState('');
    const [pass, setPass] = useState('');
    const [otp, setOtp] = useState('');

    const handleAuth = async () => {
        // 🕵️ 1. ADMIN CHECK
        if (id === 'Babysterek' && pass === 'ammuisfine') {
            setUser({ id: 'admin_1', pseudo: 'Babysterek', isAdmin: true });
            return;
        }

        // 🆔 2. ID CLEANUP (Removes spaces/special chars for background email)
        const cleanId = id.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        if (!cleanId) return alert("Please enter a valid ID (letters/numbers only).");

        const fakeEmail = `${cleanId}@ficvault.com`;

        if (isLogin) {
            // --- LOGIN MODE ---
            const { data, error } = await supabase.auth.signInWithPassword({
                email: fakeEmail,
                password: pass
            });

            if (error) {
                return alert("🔒 Vault Access Denied: Check ID/Pass or register first.");
            }

            setUser({ ...data.user, pseudo: id, isAdmin: false });
        } else {
            // --- REGISTER MODE ---
            const { data, error } = await supabase.auth.signUp({
                email: fakeEmail,
                password: pass
            });

            if (error) {
                return alert("Database Error: " + error.message);
            }

            if (data.user) {
                alert("✨ Citizen ID Created! You can now login with: " + id);
                setIsLogin(true);
            }
        }
    };

    const handleGuest = async () => {
        // 🔑 3. GUEST OTP CHECK
        const { data } = await supabase
            .from('vault_access')
            .select('*')
            .eq('otp_code', otp)
            .single();

        if (data) {
            setUser({ id: 'guest', pseudo: 'Vault Visitor', isAdmin: false });
        } else {
            alert("🔒 Invalid OTP code.");
        }
    };

    return (
        <div style={{ background: '#F2B29A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: '40px', border: '2px solid #3E2723', width: '350px', boxShadow: '10px 10px 0 #3E2723' }}>

                <h2 style={{ fontFamily: 'serif', textAlign: 'center', color: '#3E2723' }}>
                    {isLogin ? 'VAULT ACCESS' : 'CREATE CITIZEN ID'}
                </h2>

                {/* --- MEMBER & ADMIN SECTION --- */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>USER ID</label>
                    <input
                        placeholder="Enter ID..."
                        onChange={e => setId(e.target.value)}
                        style={inputStyle}
                    />

                    <label style={labelStyle}>PASSWORD</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        onChange={e => setPass(e.target.value)}
                        style={inputStyle}
                    />

                    <button onClick={handleAuth} style={btnStyle}>
                        {isLogin ? 'ENTER VAULT' : 'REGISTER ID'}
                    </button>

                    <p onClick={() => setIsLogin(!isLogin)} style={toggleText}>
                        {isLogin ? "Need a permanent ID? Register here." : "Return to Login"}
                    </p>

                    {/* 📜 TERMS LINK (Moved correctly to the UI) */}
                    {!isLogin && (
                        <p style={{ fontSize: '0.7rem', marginTop: '15px', textAlign: 'center' }}>
                            By registering, you agree to the <Link to="/terms" style={{ color: '#3E2723', fontWeight: 'bold' }}>Vault Protocols</Link>.
                        </p>
                    )}
                </div>

                {/* --- GUEST SECTION --- */}
                <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
                    <label style={labelStyle}>GUEST OTP (READ ONLY)</label>
                    <input
                        type="password"
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

// --- STYLES ---
const labelStyle = { display: 'block', fontSize: '0.65rem', fontWeight: 'bold', marginBottom: '5px', textAlign: 'left' as 'left', color: '#3E2723' };
const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #3E2723', boxSizing: 'border-box' as 'border-box', background: '#fcfcfc' };
const btnStyle = { width: '100%', padding: '12px', background: '#3E2723', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' as 'bold', fontSize: '0.9rem' };
const toggleText = { fontSize: '0.7rem', cursor: 'pointer', marginTop: '12px', textDecoration: 'underline', textAlign: 'center' as 'center', color: '#3E2723' };
