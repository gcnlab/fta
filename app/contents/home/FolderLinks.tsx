// /app/components/FolderLinks.tsx

'use client';

import { useState } from 'react';
import Tooltip from '../../components/Tooltip';

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

      {/* メインリンク */}
      <div className="flex items-center mb-0">
        <div className="grid grid-cols-1 gap-2 w-full">
          <button
            onClick={(e) =>
              copyToClipboard(
                'G:\\共有ドライブ\\DKI_zA-3_開発１部_化学_共有_SPIS\\03_SPIS\\20_フォロー業務　問合・依頼対応一覧\\問い合せ・仕様変更・不具合対応（周辺システム）',
                e
              )
            }
            className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-0.5 rounded mb-2 w-full text-left whitespace-nowrap"
          >
            問い合せ・仕様変更・不具合対応（周辺システム）
          </button>
        </div>
      </div>

      <div className="flex items-center mb-2">
        <div className="grid grid-cols-3 gap-2 w-full">
          {[
            { path: 'G:\\共有ドライブ\\DKI_A-3_開発１部_化学_共有\\01_化学Gr_LVL3\\運用B01　運用業務\\U010　定例運用', label: '定例運用' },
            { path: 'G:\\共有ドライブ\\DKI_A-3_開発１部_化学_共有\\01_化学Gr_LVL3\\管理\\50　化学Grミーティング\\業務報告（アイスター）', label: '業務報告（WBS）' },
            { path: 'G:\\共有ドライブ\\DKI_A-3_開発１部_化学_共有\\01_化学Gr_LVL3\\管理\\99　★作業実績', label: '作業実績' },
          ].map((item, index) => (
            <button
              key={index}
              onClick={(e) => copyToClipboard(item.path, e)}
              className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-0.5 rounded w-full text-center whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 見出しとボタン群 */}
      {['GSE開発', 'GIO開発'].map((section, sectionIndex) => (
        <div className="flex items-center mb-2" key={sectionIndex}>
          <h3 className="text-end text-sm font-semibold text-gray-100 mr-2 w-20 whitespace-nowrap">{section}</h3>
          <div className="grid grid-cols-4 gap-2 w-full">
            {['DB-d', 'DB-e', 'AP-d', 'AP-e'].map((label, btnIndex) => (
              <button
                key={btnIndex}
                onClick={(e) => copyToClipboard(`\\\\10.219.7.${sectionIndex === 0 ? '76' : '49'}\\${label.split('-')[1]}$`, e)}
                className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center whitespace-nowrap"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
