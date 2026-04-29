import { Link } from 'react-router-dom';

interface StoryCardProps {
    story: any;
}

export default function StoryCard({ story }: StoryCardProps) {
    // 📊 Use the processed counts from Home.tsx
    const currentChapters = story.live_chapter_count || 0;
    const expectedChapters = story.expected_chapters || '?';
    const wordCount = story.total_word_count || 0;

    return (
        <div style={{
            background: 'white',
            padding: '25px',
            border: '1px solid #3E2723',
            boxShadow: '6px 6px 0px #3E2723',
            marginBottom: '30px',
            textAlign: 'left',
            position: 'relative'
        }}>
            {/* 🏷️ TOP ROW: TITLE & CHAPTERS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <Link
                        to={`/read/${story.id}`}
                        style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#3E2723', textDecoration: 'none' }}
                    >
                        {story.title}
                    </Link>
                    {story.status === 'draft' && (
                        <span style={{
                            color: '#d32f2f',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            marginLeft: '10px',
                            border: '1px solid #d32f2f',
                            padding: '2px 5px',
                            borderRadius: '3px',
                            verticalAlign: 'middle'
                        }}>
                            DRAFT
                        </span>
                    )}
                    <p style={{ margin: '5px 0', fontSize: '1.1rem' }}>
                        By <strong>{story.author || 'Babysterek'}</strong>
                    </p>
                </div>

                {/* 📊 PROGRESS & WORD COUNT */}
                <div style={{ textAlign: 'right', minWidth: '120px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#3E2723' }}>
                        {currentChapters}/{expectedChapters}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666', margin: '2px 0' }}>
                        {wordCount.toLocaleString()} Words
                    </div>
                    <div style={{
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        color: story.is_complete ? '#2e7d32' : '#ed6c02',
                        textTransform: 'uppercase',
                        marginTop: '5px'
                    }}>
                        {story.is_complete ? '● Completed' : '○ Ongoing'}
                    </div>
                </div>
            </div>

            {/* 🏷️ FANDOMS / TAGS */}
            <p style={{ color: '#5D4037', fontWeight: 'bold', fontSize: '0.85rem', margin: '15px 0', textTransform: 'uppercase' }}>
                {story.fandoms || 'Original Work'}
            </p>

            {/* 📖 SUMMARY BOX */}
            {story.summary && (
                <blockquote style={{
                    fontSize: '0.95rem',
                    borderLeft: '4px solid #3E2723',
                    paddingLeft: '15px',
                    margin: '15px 0',
                    fontStyle: 'italic',
                    color: '#444',
                    lineHeight: '1.5'
                }}>
                    {story.summary}
                </blockquote>
            )}

            {/* 🔗 BOTTOM ACTION BAR */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '20px',
                borderTop: '1px solid #eee',
                paddingTop: '15px'
            }}>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>
                    Updated: {new Date(story.created_at).toLocaleDateString()}
                </span>
                <Link
                    to={`/read/${story.id}`}
                    style={{
                        fontWeight: 'bold',
                        color: 'white',
                        background: '#3E2723',
                        padding: '8px 20px',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        boxShadow: '3px 3px 0px #ccc'
                    }}
                >
                    OPEN FILE →
                </Link>
            </div>
        </div>
    );
}
