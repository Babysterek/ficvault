import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Gatekeeper from './components/Gatekeeper';
import Home from './pages/Home';
import Reader from './pages/Reader';
import NewStory from './pages/NewStory';
import MyStories from './pages/MyStories';
import AdminPortal from './pages/AdminPortal';
import PreHome from './pages/PreHome';
import PostChapter from './pages/PostChapter'; // 1. ADD THIS IMPORT
import './App.css';

function App() {
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('ficvault_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('ficvault_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ficvault_user');
    }
  }, [user]);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<PreHome />} />

          <Route
            path="/entry"
            element={!user ? <Gatekeeper setUser={setUser} /> : <Navigate to="/archive" />}
          />

          <Route
            path="/archive"
            element={user ? <Home user={user} /> : <Navigate to="/entry" />}
          />

          <Route path="/read/:id" element={user ? <Reader user={user} /> : <Navigate to="/entry" />} />

          <Route
            path="/post-work"
            element={user?.isAdmin ? <NewStory /> : <Navigate to="/archive" />}
          />

          {/* 2. ADD THIS ROUTE SO YOU CAN POST CHAPTERS */}
          <Route
            path="/post-chapter"
            element={user?.isAdmin ? <PostChapter /> : <Navigate to="/archive" />}
          />

          <Route
            path="/admin-portal"
            element={user?.isAdmin ? <AdminPortal /> : <Navigate to="/archive" />}
          />

          <Route path="/my-stories" element={user ? <MyStories user={user} /> : <Navigate to="/entry" />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
