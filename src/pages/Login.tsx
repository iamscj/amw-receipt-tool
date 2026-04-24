import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, AUTH_EMAIL } from '../services/auth';
import { FileText } from 'lucide-react';
import '../styles/Login.css';

export function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(AUTH_EMAIL, password);

      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password');
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
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={AUTH_EMAIL}
              disabled
              className="form-input form-input-disabled"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="form-input"
              placeholder="Enter password"
              autoComplete="current-password"
              autoFocus
            />
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
