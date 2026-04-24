import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import '../styles/Toast.css';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {type === 'success' ? (
          <CheckCircle size={20} />
        ) : (
          <XCircle size={20} />
        )}
      </div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>
        <X size={18} />
      </button>
    </div>
  );
}
