import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Home() {
    const [stories, setStories] = useState<any[]>([]);

    useEffect(() => {
        const fetchStories = async () => {
            const { data } = await supabase
                .from('stories')
                .select('*')
                .order('created_at', { ascending: false });
            if (data) setStories(data);
        };
        fetchStories();
    }, []);

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px', textAlign: 'left', backgroundColor: 'white', minHeight: '100vh' }}>
            <h1 style={{ borderBottom: '2px solid #900', color: '#900', fontFamily: 'serif' }}>Archive of Our Own</h1>

            {stories.length === 0 ? (
                <p style={{ padding: '20px' }}>Loading the vault... (If this stays empty, check your Supabase policies!)</p>
            ) : (
                stories.map(story => (
                    <div key={story.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', boxShadow: '2px 2px 0 #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Link to={`/read/${story.id}`} style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#900', textDecoration: 'none' }}>
                                {story.title}
                            </Link>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{story.rating}</span>
                        </div>
                        <p style={{ margin: '5px 0' }}>by <strong>{story.author}</strong></p>
                        <p style={{ color: '#900', fontWeight: 'bold', fontSize: '0.9rem' }}>{story.fandoms}</p>

                        <div style={{ fontSize: '0.8rem', margin: '10px 0' }}>
                            <strong>Warnings:</strong> <span style={{ color: '#900' }}>{story.archive_warnings}</span> |
                            <strong> Relationships:</strong> {story.relationships} |
                            <strong> Characters:</strong> {story.characters}
                        </div>

                        <blockquote style={{ fontSize: '0.9rem', borderLeft: '3px solid #ccc', paddingLeft: '10px', color: '#333' }}>
                            {story.summary}
                        </blockquote>

                        <p style={{ fontSize: '0.7rem', color: '#666' }}>Tags: {story.additional_tags}</p>
                    </div>
                ))
            )}
        </div>
    );
}
