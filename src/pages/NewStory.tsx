import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function NewStory() {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [profiles, setProfiles] = useState<any[]>([]);

    // Fetch users for the management table
    useEffect(() => {
        const fetchUsers = async () => {
            const { data } = await supabase.from('profiles').select('*');
            if (data) setProfiles(data);
        };
        fetchUsers();
    }, []);

    const handlePublish = async () => {
        if (!title || !file) {
            alert("Please provide both a title and an EPUB file.");
            return;
        }

        setLoading(true);

        try {
            // 1. Upload EPUB to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const { data: storageData, error: storageError } = await supabase.storage
                .from('epubs')
                .upload(fileName, file);

            if (storageError) throw storageError;

            // 2. Save Story Info to Database
            const { error: dbError } = await supabase
                .from('stories')
                .insert([{
                    title: title,
                    file_url: storageData.path,
                    author: 'Babysterek'
                }]);

            if (dbError) throw dbError;

            alert("🎉 Story successfully published to the Vault!");
            setTitle('');
            setFile(null);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const revokeAccess = async (id: string) => {
        await supabase.from('profiles').delete().eq('id', id);
        setProfiles(profiles.filter(p => p.id !== id));
    };

    return (
        <div style={{ padding: '40px', background: '#F2B29A', minHeight: '100vh' }}>
            <Link to="/" style={{ color: '#3E2723', textDecoration: 'none' }}>← Exit Command Center</Link>

            {/* PUBLISH SECTION */}
            <div className="vault-card" style={{ margin: '40px auto', width: '550px', background: 'white' }}>
                <h2 style={{ fontFamily: 'serif' }}>ADMIN: POST NEW WORK</h2>
                <input
                    placeholder="STORY TITLE"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ border: '1px solid #3E2723', padding: '10px', marginBottom: '20px' }}
                />
                <div style={{ margin: '20px 0', textAlign: 'left' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>SOURCE FILE (EPUB)</label>
                    <input
                        type="file"
                        accept=".epub"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        style={{ border: 'none', marginTop: '10px' }}
                    />
                </div>
                <button
                    onClick={handlePublish}
                    disabled={loading}
                    style={{ width: '100%', opacity: loading ? 0.5 : 1 }}
                >
                    {loading ? 'ARCHIVING...' : 'PUBLISH TO ARCHIVE'}
                </button>
            </div>

            {/* USER MANAGEMENT SECTION */}
            <div style={{ maxWidth: '800px', margin: 'auto', background: 'white', padding: '20px', border: '1px solid #3E2723' }}>
                <h3 style={{ margin: 0 }}>USER MANAGEMENT</h3>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>View and manage site access for pseudonyms.</p>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #3E2723', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>Pseudonym</th>
                            <th style={{ padding: '10px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profiles.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}>{p.username}</td>
                                <td style={{ padding: '10px' }}>
                                    {p.username !== 'Babysterek' && (
                                        <button
                                            onClick={() => revokeAccess(p.id)}
                                            style={{ background: 'red', fontSize: '0.6rem', padding: '5px 10px' }}
                                        >
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
