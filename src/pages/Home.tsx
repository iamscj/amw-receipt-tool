import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReceiptForm } from '../components/ReceiptForm';
import { isAdmin } from '../services/auth';

export function Home() {
  const userIsAdmin = isAdmin();
  const navigate = useNavigate();

  // Redirect viewers to receipts page
  useEffect(() => {
    if (!userIsAdmin) {
      navigate('/receipts', { replace: true });
    }
  }, [userIsAdmin, navigate]);

  // Only show form for admin users
  if (!userIsAdmin) {
    return null; // Or a loading spinner while redirecting
  }

  return <ReceiptForm />;
}
