// app/components/Notification.tsx

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface NotificationProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 1000); // 1秒後に自動的に消える
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div
        className={`bg-pink-50 text-xs text-slate-500 px-3 py-2 rounded-md shadow-md transform transition-opacity duration-100 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {message}
      </div>
    </div>,
    document.body
  );
};

export default React.memo(Notification);

