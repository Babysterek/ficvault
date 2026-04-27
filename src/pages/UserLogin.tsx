import { useState } from 'react';
import { supabase } from '../supabase';

export default function UserLogin() {
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        // We add an underscore to _pass so the computer ignores it
        const _pass = "Checking...";

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });

        if (error) alert(error.message);
        setLoading(false);
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Welcome Back</h1>
                <p>Please sign in to access the archive collection.</p>

                <button
                    className="primary"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                >
                    {loading ? 'Connecting...' : 'Sign in with Google'}
                </button>
            </div>
        </div>
    );
}
