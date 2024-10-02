// /app/contents/wizards/migration/components/Tooltip.tsx

import React from 'react';
import ReactDOM from 'react-dom';

interface TooltipProps {
  message: string;
  x: number;
  y: number;
}

const Tooltip: React.FC<TooltipProps> = ({ message, x, y }) => {
  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    top: y,
    left: x,
    pointerEvents: 'none',
    zIndex: 9999,
  };

  return ReactDOM.createPortal(
    <div
      className="px-4 py-2 bg-gray-800 text-white text-sm rounded-md shadow-lg transition-opacity duration-300"
      style={tooltipStyle}
    >
      {message}
    </div>,
    document.body
  );
};

export default React.memo(Tooltip);
