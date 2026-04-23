import React from 'react';
import { Link } from 'react-router-dom';
export default function PreHome() {
    return (
        <div style={{ textAlign: 'center', padding: '100px' }}>
            <h1>THE ARCHIVE</h1>
            <Link to="/" style={{ color: '#3E2723' }}>ENTER COLLECTION</Link>
        </div>
    );
}
