import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, ADMIN_EMAIL, VIEWER_EMAIL } from '../services/auth';
import { FileText, Eye, EyeOff } from 'lucide-react';
import '../styles/Login.css';

export function Login() {
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Map role to email
      const email = role === 'admin' ? ADMIN_EMAIL : VIEWER_EMAIL;

      const success = await login(email, password);

      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials');
        setPassword('');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <FileText />
          </div>
          <h1 className="login-title">AMW Receipt Tool</h1>
          <p className="login-subtitle">AMW Owners Interim Forum</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Login As
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              disabled={loading}
              className="form-input"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="form-input password-input"
                placeholder="Enter password"
                autoComplete="current-password"
                autoFocus
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="login-button">
            {loading ? (
              <>
                <div className="spinner-small" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Authorized users only</p>
        </div>
      </div>
    </div>
  );
}
