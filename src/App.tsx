import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Gatekeeper from './components/Gatekeeper';
import Home from './pages/Home';
import Reader from './pages/Reader';
import NewStory from './pages/NewStory';
import MyStories from './pages/MyStories';
import AdminPortal from './pages/AdminPortal';
import './App.css';

function App() {
  const [user, setUser] = useState<any>(null);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public Gate */}
          <Route path="/entry" element={!user ? <Gatekeeper setUser={setUser} /> : <Navigate to="/" />} />

          {/* Protected Archive */}
          <Route path="/" element={user ? <Home user={user} /> : <Navigate to="/entry" />} />
          <Route path="/read/:id" element={user ? <Reader user={user} /> : <Navigate to="/entry" />} />
          <Route path="/my-stories" element={user ? <MyStories user={user} /> : <Navigate to="/entry" />} />

          {/* Admin Tools */}
          <Route path="/post-work" element={user?.isAdmin ? <NewStory /> : <Navigate to="/" />} />
          <Route path="/admin-portal" element={user?.isAdmin ? <AdminPortal /> : <Navigate to="/" />} />

          <Route path="*" element={<Navigate to="/entry" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
