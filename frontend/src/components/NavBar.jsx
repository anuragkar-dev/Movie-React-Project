import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import "../css/NavBar.css";

function NavBar() {
  const { user, logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Movie App</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/favorites" className="nav-link">Favorites</Link>
        {user ? (
          <Link to="/" onClick={handleLogout} className="nav-link">Logout</Link>
        ) : (
          <Link to="/login" className="nav-link">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
