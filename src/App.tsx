import { Routes, Route, Navigate } from "react-router-dom";

/* ===== PAGES ===== */
import PreHome from "./pages/PreHome";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";

import CreateProfile from "./pages/CreateProfile";
import Home from "./pages/Home";
import MyStories from "./pages/MyStories";
import Bookmarks from "./pages/Bookmarks";
import NewStory from "./pages/NewStory";
import Reader from "./pages/Reader";
import AdminPortal from "./pages/AdminPortal";

/* ===== COMPONENTS ===== */
import Layout from "./components/Layout";
import Gatekeeper from "./components/Gatekeeper";

/* ===== WRAPPER ===== */
const WithLayout = ({ children }: any) => {
  return <Layout>{children}</Layout>;
};

export default function App() {
  return (
    <Routes>

      {/* ===== ENTRY ===== */}
      <Route path="/" element={<PreHome />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* ===== PROFILE ===== */}
      <Route
        path="/create-profile"
        element={
          <Gatekeeper>
            <CreateProfile />
          </Gatekeeper>
        }
      />

      {/* ===== HOME ===== */}
      <Route
        path="/home"
        element={
          <Gatekeeper requireProfile>
            <WithLayout>
              <Home />
            </WithLayout>
          </Gatekeeper>
        }
      />

      {/* ===== MY STORIES ===== */}
      <Route
        path="/my-stories"
        element={
          <Gatekeeper requireProfile>
            <WithLayout>
              <MyStories />
            </WithLayout>
          </Gatekeeper>
        }
      />

      {/* ===== BOOKMARKS ===== */}
      <Route
        path="/bookmarks"
        element={
          <Gatekeeper requireProfile>
            <WithLayout>
              <Bookmarks />
            </WithLayout>
          </Gatekeeper>
        }
      />

      {/* ===== ADMIN PANEL ===== */}
      <Route
        path="/admin"
        element={
          <Gatekeeper requireAdmin>
            <WithLayout>
              <AdminPortal />
            </WithLayout>
          </Gatekeeper>
        }
      />

      {/* ===== NEW STORY (ADMIN ONLY) ===== */}
      <Route
        path="/new"
        element={
          <Gatekeeper requireAdmin>
            <WithLayout>
              <NewStory />
            </WithLayout>
          </Gatekeeper>
        }
      />

      {/* ===== READER (NO LAYOUT — IMMERSIVE) ===== */}
      <Route
        path="/story/:id"
        element={
          <Gatekeeper>
            <Reader />
          </Gatekeeper>
        }
      />

      {/* ===== FALLBACK ===== */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}