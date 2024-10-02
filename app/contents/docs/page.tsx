// /app/contents/docs/page.tsx

"use client";

import { useState, useEffect } from "react";
import { MainButton } from "@/app/components/MainButton";
import { WhitePanel } from "@/app/components/WhitePanel";

export default function Page() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null); // 選択されたボタンの状態
  const [activeToggle, setActiveToggle] = useState<string | null>(null); // アクティブなトグルボタンのラベル

  const SELECTED_TOOL_KEY = 'selectedToolDocs';

  const handleToggle = (toolName: string) => {
    if (activeToggle === toolName) {
      // トグルボタンのアクティブ状態を解除
      setActiveToggle(null);
      setSelectedTool(null);
      localStorage.removeItem(SELECTED_TOOL_KEY);
    } else {
      // トグルボタンをアクティブに設定
      setActiveToggle(toolName);
      setSelectedTool(toolName);
      localStorage.setItem(SELECTED_TOOL_KEY, toolName);
    }
  };

  // ページが読み込まれたときに localStorage から状態を復元
  useEffect(() => {
    const savedTool = localStorage.getItem(SELECTED_TOOL_KEY);
    if (savedTool) {
      setSelectedTool(savedTool);
      setActiveToggle(savedTool);
    }
  }, []);

  return (
    <main className="bg-gray-100">
      <div className="mb-2 p-4 bg-white shadow-lg rounded-md border border-gray-300">
        <h1 className="text-base font-semibold text-gray-700 mb-4 text-left">Docs</h1>

        {/* ボタンパネル */}
        <div className="grid grid-cols-5 gap-2">
          {/* 各種手順書 (トグルボタン) */}
          <MainButton
            label="各種手順書"
            isToggle={true}
            isActive={activeToggle === "各種手順書"}
            onToggle={() => handleToggle("各種手順書")}
          />

          {/* Cheat Sheets (トグルボタン) */}
          <MainButton
            label="Cheat Sheets"
            isToggle={true}
            isActive={activeToggle === "Cheat Sheets"}
            onToggle={() => handleToggle("Cheat Sheets")}
          />

          {/* ダミーボタン */}
          <MainButton label="" isDummy={true} />

          {/* ダミーボタン (7つ) */}
          {[...Array(7)].map((_, index) => (
            <MainButton
              key={index}
              label="&nbsp;"
              isDummy={true}
              onClickAction={() => {
                // ダミーボタンをクリックしても何も起こらないように
                // 必要に応じて他のアクションを追加できます
              }}
            />
          ))}
        </div>

        {/* 選択されたツールに基づいてWhitePanelを表示 */}
        <div className="h-auto min-h-64 mt-4 p-4 bg-gray-100 rounded-md border border-gray-300">
          {selectedTool && (
            <WhitePanel height="360px"> {/* 高さを指定 */}
              <h2 className="text-sm font-semibold text-gray-700">{selectedTool}</h2>
              <p className="text-xs text-gray-600 mt-2">{selectedTool}のコンテンツです。</p>
            </WhitePanel>
          )}
        </div>
      </div>
    </main>
  );
}
