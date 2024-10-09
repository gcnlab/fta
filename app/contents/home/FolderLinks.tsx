'use client';

import React, { useState } from 'react';
import Tooltip from '../../components/Tooltip';
import data from './data/folderLinksData.json'; // JSONデータを読み込み

interface ButtonData {
  label: string;
  url: string;
  shiftUrl: string | null;
}

interface CategoryData {
  category: string;
  heading: string | null;
  buttons: ButtonData[];
}

export default function FolderLinks() {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const copyToClipboard = (text: string, event: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(text).then(() => {
      const tooltipX = event.clientX + 20;
      const tooltipY = event.clientY - 20;
      setTooltipPosition({ x: tooltipX, y: tooltipY });
      setTooltipVisible(true);
    }).catch(() => {
      alert('クリップボードへのコピーに失敗しました。');
    });
  };

  return (
    <div className="p-8 border border-gray-600 min-w-[500px] min-h-[250px] bg-transparent relative flex-shrink-0">
      <h2 className="text-lg font-semibold text-gray-100 mb-4 whitespace-nowrap">Folder Links</h2>
      <p className="text-gray-400 mb-2 text-xs text-end whitespace-nowrap">Copy Path to Clipboard</p>

      {tooltipVisible && (
        <Tooltip
          message="コピーしました"
          position={tooltipPosition}
          visible={tooltipVisible}
          duration={350}
          onClose={() => setTooltipVisible(false)}
        />
      )}

      {/* メインリンク (カテゴリがリンク1の場合のみ全幅) */}
      {data.map((category: CategoryData, index: number) => (
        <div key={index}>
          {/* カテゴリごとの処理 */}
          {category.category === "LINK1" ? (
            <div className="flex items-center mb-0">
              <div className="grid grid-cols-1 gap-2 w-full">
                {category.buttons.map((button, btnIndex) => (
                  <button
                    key={btnIndex}
                    onClick={(e) => copyToClipboard(button.url, e)}
                    className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-0.5 rounded w-full text-left whitespace-nowrap"
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          ) : category.heading === null ? (
            <div className="flex items-center mb-2">
              <div className="grid grid-cols-3 gap-2 w-full">
                {category.buttons.map((button, btnIndex) => (
                  <button
                    key={btnIndex}
                    onClick={(e) => copyToClipboard(button.url, e)}
                    className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-0.5 rounded w-full text-center whitespace-nowrap"
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center mb-2">
              <h3 className="text-end text-sm font-semibold text-gray-100 mr-2 w-20 whitespace-nowrap">{category.heading}</h3>
              <div className="grid grid-cols-4 gap-2 w-full">
                {category.buttons.map((button, btnIndex) => (
                  <button
                    key={btnIndex}
                    onClick={(e) => copyToClipboard(button.url, e)}
                    className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center whitespace-nowrap"
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
