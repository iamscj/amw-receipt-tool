import { FileText, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-header">
      <div className="app-icon">
        <FileText />
      </div>
      <h1 className="app-title">AMW Receipt Generator</h1>
      <p className="app-subtitle">AMW Owners Interim Forum</p>

      {/* Navigation Links */}
      <div className="header-nav">
        {isHomePage ? (
          <Link to="/receipts" className="nav-link">
            View All Receipts
          </Link>
        ) : (
          <Link to="/" className="nav-link">
            Create New Receipt
          </Link>
        )}

        <button onClick={handleLogout} className="logout-button">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
