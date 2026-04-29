import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Home({ user }: any) {
    const [stories, setStories] = useState<any[]>([]);

    useEffect(() => {
        const fetchStories = async () => {
            const { data } = await supabase.from('stories').select('*').order('created_at', { ascending: false });
            if (data) setStories(data);
        };
        fetchStories();
    }, []);

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px', textAlign: 'left' }}>
            <h1 style={{ borderBottom: '2px solid #900', color: '#900' }}>ARCHIVE OF OUR OWN (CLONE)</h1>
            {stories.map(story => (
                <div key={story.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Link to={`/read/${story.id}`} style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#900' }}>{story.title}</Link>
                        <span style={{ fontWeight: 'bold' }}>{story.rating}</span>
                    </div>
                    <p style={{ margin: '5px 0' }}>by <strong>{story.author}</strong></p>
                    <p style={{ fontSize: '0.9rem', color: '#900', fontWeight: 'bold' }}>{story.fandoms}</p>
                    <p style={{ fontSize: '0.8rem' }}>
                        <strong>Warnings:</strong> {story.archive_warnings} |
                        <strong> Relationships:</strong> {story.relationships} |
                        <strong> Characters:</strong> {story.characters}
                    </p>
                    <blockquote style={{ fontSize: '0.9rem', borderLeft: '3px solid #ccc', paddingLeft: '10px', margin: '10px 0' }}>
                        {story.summary}
                    </blockquote>
                    <p style={{ fontSize: '0.8rem', color: '#666' }}>Tags: {story.additional_tags}</p>
                </div>
            ))}
        </div>
    );
}
