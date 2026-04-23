import React, { useState } from 'react';

export default function UserLogin({ setUser }: any) {
    const [invite, setInvite] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [pass, setPass] = useState('');
    const [adminKey, setAdminKey] = useState('');
    const [sub, setSub] = useState(false);

    const isUnlocked = invite.toLowerCase() === 'halefire';

    const handleAccess = () => {
        const isAdmin = pseudo.toLowerCase() === 'babysterek' && adminKey === 'ammuisfine';
        setUser({
            pseudo: pseudo || 'Anonymous',
            isAdmin: isAdmin,
            isSubscribed: sub
        });
    };

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="vault-card">
                <h1 style={{ letterSpacing: '4px' }}>FICVAULT</h1>
                <p style={{ fontSize: '0.7rem', marginBottom: '20px' }}>ARCHIVE ACCESS REQUIRED</p>

                <input
                    placeholder="INVITATION CODE"
                    type="text"
                    onChange={(e) => setInvite(e.target.value)}
                />

                {isUnlocked && (
                    <div className="fade-in">
                        <input placeholder="PSEUDONYM" onChange={(e) => setPseudo(e.target.value)} />
                        <input type="password" placeholder="VAULT PASSWORD" onChange={(e) => setPass(e.target.value)} />

                        {pseudo.toLowerCase() === 'babysterek' && (
                            <input
                                type="password"
                                placeholder="ADMIN KEY (ammuisfine)"
                                onChange={(e) => setAdminKey(e.target.value)}
                                style={{ borderBottom: '2px solid red' }}
                            />
                        )}

                        <div style={{ margin: '20px 0', cursor: 'pointer' }} onClick={() => setSub(!sub)}>
                            <img
                                src="https://giphy.com"
                                alt="Megaphone"
                                style={{ width: '40px', opacity: sub ? 1 : 0.3 }}
                            />
                            <p style={{ fontSize: '0.7rem' }}>{sub ? 'Subscribed to Site Updates' : 'Enable Notifications?'}</p>
                        </div>

                        <button style={{ width: '100%' }} onClick={handleAccess}>
                            {pseudo.toLowerCase() === 'babysterek' ? 'UNLOCK ADMIN VAULT' : 'ENTER THE VAULT'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
