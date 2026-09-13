import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Admin from "./pages/Admin";
import Permissions from "./pages/Permissions";
import AccessValidation from "./pages/AccessValidation";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

const STORAGE_KEY = "travelGalleryAccess";
const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

function isSessionExpired(session) {
  if (!session || !session.createdAt) return true;
  return Date.now() - session.createdAt > SESSION_TIMEOUT;
}

function getAccessSession() {
  try {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (isSessionExpired(session)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function RequireAccess({ children, requireAdmin = false }) {
  const access = getAccessSession();

  if (!access || !access.emailId) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && access.role !== "ADMIN") {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default function App() {
  const location = useLocation();
  const access = getAccessSession();
  const showNavbar = location.pathname !== "/" || Boolean(access);

  return (
    <>
      <ScrollToTop />
      {showNavbar && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            access && access.emailId ? (
              <Navigate to="/home" replace />
            ) : (
              <AccessValidation />
            )
          }
        />
        <Route
          path="/home"
          element={
            <RequireAccess>
              <Home />
            </RequireAccess>
          }
        />
        <Route
          path="/travel/:slug"
          element={
            <RequireAccess>
              <Gallery />
            </RequireAccess>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAccess requireAdmin>
              <Admin />
            </RequireAccess>
          }
        />
        <Route
          path="/permissions"
          element={
            <RequireAccess requireAdmin>
              <Permissions />
            </RequireAccess>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
