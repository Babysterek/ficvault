import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Gatekeeper from './components/Gatekeeper';
import Home from './pages/Home';
import Reader from './pages/Reader';
import NewStory from './pages/NewStory';
import MyStories from './pages/MyStories';
import AdminPortal from './pages/AdminPortal';
import PreHome from './pages/PreHome';
import PostChapter from './pages/PostChapter';
import ManageStories from './pages/ManageStories';
import PostWordDoc from './pages/PostWordDoc';
import PostEpub from './pages/PostEpub';
import EditChapter from './pages/EditChapter'; // 1. IMPORT EDIT PAGE
import './App.css';

function App() {
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('ficvault_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('ficvault_user', JSON.stringify(user));
    else localStorage.removeItem('ficvault_user');
  }, [user]);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<PreHome />} />
          <Route path="/entry" element={!user ? <Gatekeeper setUser={setUser} /> : <Navigate to="/archive" />} />
          <Route path="/archive" element={user ? <Home user={user} /> : <Navigate to="/entry" />} />
          <Route path="/read/:id" element={user ? <Reader /> : <Navigate to="/entry" />} />

          <Route path="/post-work" element={user?.isAdmin ? <NewStory /> : <Navigate to="/archive" />} />
          <Route path="/post-chapter" element={user?.isAdmin ? <PostChapter /> : <Navigate to="/archive" />} />
          <Route path="/post-word" element={user?.isAdmin ? <PostWordDoc /> : <Navigate to="/archive" />} />
          <Route path="/post-epub" element={user?.isAdmin ? <PostEpub /> : <Navigate to="/archive" />} />

          {/* 2. ADD THE EDIT ROUTE HERE */}
          <Route path="/edit-chapter/:id" element={user?.isAdmin ? <EditChapter /> : <Navigate to="/archive" />} />

          <Route path="/manage-stories" element={user?.isAdmin ? <ManageStories /> : <Navigate to="/archive" />} />
          <Route path="/admin-portal" element={user?.isAdmin ? <AdminPortal /> : <Navigate to="/archive" />} />
          <Route path="/my-stories" element={user ? <MyStories /> : <Navigate to="/entry" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
