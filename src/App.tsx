import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { ReceiptsList } from './pages/ReceiptsList';
import { onAuthChange } from './services/auth';
import './App.css';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner-large" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router key={user ? 'authenticated' : 'unauthenticated'}>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <div className="app-wrapper">
                  <Header />

                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/receipts" element={<ReceiptsList />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
