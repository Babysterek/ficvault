import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function AdminPortal() {
    const [profiles, setProfiles] = useState<any[]>([]);

    useEffect(() => {
        const getProfiles = async () => {
            const { data } = await supabase.from('profiles').select('*');
            if (data) setProfiles(data);
        };
        getProfiles();
    }, []);

    const revokeAccess = async (id: string) => {
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (!error) {
            setProfiles(profiles.filter(p => p.id !== id));
            alert("Member access revoked.");
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: 'auto' }}>
            <nav style={{ marginBottom: '40px' }}>
                <Link to="/" style={{ color: '#3E2723' }}>← Return to Archive</Link>
            </nav>

            <h1 style={{ borderBottom: '2px solid #3E2723', paddingBottom: '10px' }}>Admin Command Center</h1>

            <div style={{ marginTop: '30px' }}>
                <h3>Vault Member Management</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', background: 'white' }}>
                    <thead>
                        <tr style={{ background: '#3E2723', color: '#F2B29A', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>Pseudonym</th>
                            <th style={{ padding: '10px' }}>Subscribed</th>
                            <th style={{ padding: '10px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profiles.map(profile => (
                            <tr key={profile.id} style={{ borderBottom: '1px solid #ccc' }}>
                                <td style={{ padding: '10px' }}>{profile.username}</td>
                                <td style={{ padding: '10px' }}>{profile.is_subscribed ? '🔔 Yes' : 'No'}</td>
                                <td style={{ padding: '10px' }}>
                                    {profile.username !== 'Babysterek' && (
                                        <button onClick={() => revokeAccess(profile.id)} style={{ background: 'red', fontSize: '0.7rem' }}>
                                            REVOKE ACCESS
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
