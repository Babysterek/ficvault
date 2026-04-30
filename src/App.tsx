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
import EditChapter from './pages/EditChapter';
import './App.css';

function App() {
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('ficvault_user');
    return saved ? JSON.parse(saved) : null;
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
          {/* 🏛️ LANDING PAGE */}
          <Route path="/" element={<PreHome />} />

          {/* 🚪 ENTRY GATE */}
          <Route
            path="/entry"
            element={!user ? <Gatekeeper setUser={setUser} /> : <Navigate to="/archive" />}
          />

          {/* 📚 MAIN ARCHIVE */}
          <Route
            path="/archive"
            element={user ? <Home user={user} /> : <Navigate to="/entry" />}
          />

          {/* 📖 THE READER (Requires User for Bookmarks/Comments) */}
          <Route
            path="/read/:id"
            element={user ? <Reader user={user} /> : <Navigate to="/entry" />}
          />

          {/* 🔐 ADMIN ONLY ROUTES (Protected by user?.isAdmin) */}
          <Route
            path="/post-work"
            element={user?.isAdmin ? <NewStory /> : <Navigate to="/archive" />}
          />
          <Route
            path="/post-chapter"
            element={user?.isAdmin ? <PostChapter /> : <Navigate to="/archive" />}
          />
          <Route
            path="/post-word"
            element={user?.isAdmin ? <PostWordDoc /> : <Navigate to="/archive" />}
          />
          <Route
            path="/post-epub"
            element={user?.isAdmin ? <PostEpub /> : <Navigate to="/archive" />}
          />
          <Route
            path="/edit-chapter/:id"
            element={user?.isAdmin ? <EditChapter /> : <Navigate to="/archive" />}
          />
          <Route
            path="/manage-stories"
            element={user?.isAdmin ? <ManageStories /> : <Navigate to="/archive" />}
          />
          <Route
            path="/admin-portal"
            element={user?.isAdmin ? <AdminPortal /> : <Navigate to="/archive" />}
          />

          {/* 🔖 REGISTERED USER ROUTES */}
          <Route
            path="/my-stories"
            element={user ? <MyStories user={user} /> : <Navigate to="/entry" />}
          />

          {/* 🔄 FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
/* 📱 MOBILE OPTIMIZATIONS */
@media(max - width: 768px) {
    /* Make the story cards and containers fill the screen */
    .app - container, .vault - list, .new - story {
    padding: 10px!important;
    width: 100 % !important;
  }

    /* Stack navigation buttons so they don't overlap */
    nav {
    flex - direction: column;
    gap: 5px!important;
  }

    /* Ensure images don't go off-screen */
    img {
    max - width: 100 % !important;
    height: auto!important;
  }

  /* 📧 FIX GMAIL SKIN FOR MOBILE */
  #workskin.gmail - interface {
    flex - direction: column; /* Stack sidebar on top of email */
    height: auto!important;
  }

  #workskin.gmail - sidebar {
    width: 100 % !important;
    display: flex;
    overflow - x: auto; /* Scrollable menu on mobile */
    white - space: nowrap;
    border - right: none;
    border - bottom: 1px solid #ddd;
  }

  #workskin.gmail - body {
    padding: 20px!important; /* Remove the large left margin on phones */
  }
}
