import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Gatekeeper from './components/Gatekeeper';
import Home from './pages/Home';
import Reader from './pages/Reader';
import NewStory from './pages/NewStory';
import MyStories from './pages/MyStories';
import AdminPortal from './pages/AdminPortal';
import PreHome from './pages/PreHome'; // Added this line
import './App.css';

function App() {
  const [user, setUser] = useState<any>(null);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* THE FRONT DOOR */}
          <Route path="/" element={<PreHome />} />

          {/* THE LOGIN GATE */}
          <Route path="/entry" element={!user ? <Gatekeeper setUser={setUser} /> : <Navigate to="/archive" />} />

          {/* THE MAIN ARCHIVE */}
          <Route path="/archive" element={user ? <Home user={user} /> : <Navigate to="/entry" />} />

          <Route path="/read/:id" element={user ? <Reader user={user} /> : <Navigate to="/entry" />} />
          <Route path="/post-work" element={user?.isAdmin ? <NewStory /> : <Navigate to="/archive" />} />
          <Route path="/admin-portal" element={user?.isAdmin ? <AdminPortal /> : <Navigate to="/archive" />} />
          <Route path="/my-stories" element={user ? <MyStories user={user} /> : <Navigate to="/entry" />} />

          {/* CATCH ALL */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
