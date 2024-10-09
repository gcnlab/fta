// /app/components/Tooltip.tsx

import React, { useEffect } from 'react';

interface TooltipProps {
    message: string;
    position: { x: number; y: number };
    visible: boolean;
    duration?: number; // 表示時間（ミリ秒）
    onClose?: () => void;
}

const Tooltip: React.FC<TooltipProps> = ({ message, position, visible, duration = 300, onClose }) => {
    useEffect(() => {
        if (visible && duration > 0) {
            const timer = setTimeout(() => {
                onClose && onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [visible, duration, onClose]);

    if (!visible) return null;

    return (
        <div
            className="fixed bg-black text-white text-xs rounded py-1 px-2 border border-white shadow-lg"
            style={{
                top: position.y,
                left: position.x,
                pointerEvents: 'none',
                zIndex: 1000,
                transform: 'translate(20%, -30%)', // ツールチップをボタンの上に表示
            }}
        >
            {message}
        </div>
    );
};

export default Tooltip;

