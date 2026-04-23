import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Gatekeeper from './components/Gatekeeper';
import Home from './pages/Home';
import Reader from './pages/Reader';
import NewStory from './pages/NewStory';
import MyStories from './pages/MyStories';
import AdminPortal from './pages/AdminPortal'; // Added this import
import './App.css';

function App() {
  const [user, setUser] = useState<any>(null);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* TIER 1: The 'halefire' Gate */}
          <Route
            path="/entry"
            element={!user ? <Gatekeeper setUser={setUser} /> : <Navigate to="/" />}
          />

          {/* HOME ARCHIVE */}
          <Route
            path="/"
            element={user ? <Home user={user} /> : <Navigate to="/entry" />}
          />

          {/* READER */}
          <Route
            path="/read/:id"
            element={user ? <Reader user={user} /> : <Navigate to="/entry" />}
          />

          {/* TIER 2: ADMIN ONLY (NewStory & Portal) */}
          <Route
            path="/post-work"
            element={user?.isAdmin ? <NewStory /> : <Navigate to="/" />}
          />

          <Route
            path="/admin-portal"
            element={user?.isAdmin ? <AdminPortal /> : <Navigate to="/" />}
          />

          {/* BOOKMARKS */}
          <Route
            path="/my-stories"
            element={user ? <MyStories user={user} /> : <Navigate to="/entry" />}
          />

          <Route path="*" element={<Navigate to="/entry" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
