import { useState } from 'react';

const Gatekeeper = ({ setUser }: any) => {
    const [_inviteCode, setInviteCode] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [adminKey, setAdminKey] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);

    const checkCode = (e: any) => {
        const val = e.target.value;
        setInviteCode(val);
        // GATE 1: The secret invitation code
        if (val.toLowerCase() === "halefire") {
            setIsUnlocked(true);
        }
    };

    const handleAccess = () => {
        // GATE 2: Admin credentials check
        const isAdmin = pseudo === 'Babysterek' && adminKey === 'ammuisfine';

        if (isUnlocked) {
            setUser({
                pseudo: pseudo || 'Anonymous',
                isAdmin: isAdmin
            });
        } else {
            alert("Access Denied: Invalid invitation code.");
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2B29A' }}>
            <div className="vault-card" style={{ background: 'white', padding: '40px', border: '1px solid #3E2723', boxShadow: '10px 10px 0px #3E2723', width: '350px' }}>
                <h2 style={{ fontFamily: 'serif', letterSpacing: '2px', textAlign: 'center', marginBottom: '20px' }}>FICVAULT ACCESS</h2>

                <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>STEP 1: INVITATION CODE</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        onChange={checkCode}
                        style={{ width: '100%', padding: '10px', border: 'none', borderBottom: '2px solid #3E2723', outline: 'none' }}
                    />
                </div>

                {isUnlocked && (
                    <div className="fade-in">
                        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                            <label style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>STEP 2: PSEUDONYM</label>
                            <input
                                placeholder="Enter your name..."
                                onChange={(e) => setPseudo(e.target.value)}
                                style={{ width: '100%', padding: '10px', border: 'none', borderBottom: '2px solid #3E2723', outline: 'none' }}
                            />
                        </div>

                        {/* ADMIN PASSWORD BOX: Only appears if the name is Babysterek */}
                        {pseudo === 'Babysterek' && (
                            <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                                <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'red' }}>STEP 3: MASTER KEY</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    onChange={(e) => setAdminKey(e.target.value)}
                                    style={{ width: '100%', padding: '10px', border: 'none', borderBottom: '2px solid red', outline: 'none' }}
                                />
                            </div>
                        )}

                        <button onClick={handleAccess} style={{ width: '100%', marginTop: '20px', background: '#3E2723', color: 'white', padding: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            {pseudo === 'Babysterek' ? 'UNLOCK MASTER VAULT' : 'ENTER ARCHIVE'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gatekeeper;
