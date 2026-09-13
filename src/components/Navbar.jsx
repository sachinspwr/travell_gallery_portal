import { Link, useNavigate } from "react-router-dom";

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

export default function Navbar() {
  const navigate = useNavigate();
  const access = getAccessSession();
  const isAdmin = access?.role === "ADMIN";

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    navigate("/", { replace: true });
  };

  return (
    <nav className="nav">
      <Link className="brand" to="/home">
        WANDER<span>LOG</span>
      </Link>
      <div>
        <Link to="/home">Home</Link>
        {isAdmin && <Link to="/admin">Admin</Link>}
        {isAdmin && <Link to="/permissions">Permissions</Link>}
        {access && (
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
