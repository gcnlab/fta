// /app/components/WhitePanel.tsx

import React, { ReactNode } from 'react';

// WhitePanelコンポーネントの型定義
interface WhitePanelProps {
  children: ReactNode;
  height?: string; // オプションで高さを受け取るプロパティ
}

export const WhitePanel = ({ children, height = "auto" }: WhitePanelProps) => {
    return (
      <div
        className="w-full p-6 bg-white shadow-lg shadow-gray-700 rounded-none border border-gray-300 relative overflow-hidden"
        style={{ height, maxHeight: '100%' }} // 高さと最大高さを指定
      >
        {/* コンテンツがはみ出したときにスクロールできるようにoverflow設定 */}
        <div className="h-full w-full overflow-auto">
          {/* 四隅の装飾 */}
          <div className="absolute top-2 left-2 h-2 w-2 bg-gray-400 rounded-full"></div>
          <div className="absolute top-2 right-2 h-2 w-2 bg-gray-400 rounded-full"></div>
          <div className="absolute bottom-2 left-2 h-2 w-2 bg-gray-400 rounded-full"></div>
          <div className="absolute bottom-2 right-2 h-2 w-2 bg-gray-400 rounded-full"></div>
          
          {/* コンテンツ */}
          {children}
        </div>
      </div>
    );
};
