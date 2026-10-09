import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const Toast = () => {
  const { toasts, removeToast } = useNotification();

  if (!toasts.length) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="var(--status-success)" />;
      case 'error':
        return <XCircle size={18} color="var(--status-danger)" />;
      case 'warning':
        return <AlertCircle size={18} color="var(--status-warning)" />;
      default:
        return <Info size={18} color="var(--status-info)" />;
    }
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item ${toast.type}`}>
          {getIcon(toast.type)}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{ color: 'var(--text-light)', display: 'flex', alignItems: 'center' }}
            aria-label="Yopish"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
};
