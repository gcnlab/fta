// /app/contents/tools/page.tsx

"use client";

import { MainButton } from "@/app/components/MainButton";
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { WhitePanel } from "@/app/components/WhitePanel";

export default function Page() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null); // 選択されたボタンの状態
  const [activeToggle, setActiveToggle] = useState<string | null>(null); // アクティブなトグルボタンのラベル
  const router = useRouter(); // ページ遷移用

  const SELECTED_TOOL_KEY = 'selectedToolTools';

  const handleButtonClick = (toolName: string) => {
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
        <h1 className="text-base font-semibold text-gray-700 mb-4 text-left">Tools</h1>

        {/* ボタンパネル */}
        <div className="grid grid-cols-5 gap-2">
          {/* 受払計算シミュレータ */}
          <MainButton
            label="受払計算シミュレータ"
            isToggle={true}
            isActive={activeToggle === "受払計算シミュレータ"}
            onToggle={() => handleButtonClick("受払計算シミュレータ")}
/>

          {/* 原単位計算シミュレータ */}
          <MainButton
            label="原単位計算シミュレータ"
            isToggle={true}
            isActive={activeToggle === "原単位計算シミュレータ"}
            onToggle={() => handleButtonClick("原単位計算シミュレータ")}
          />

          {/* JSON Parser */}
          <MainButton
            label="JSON Parser"
            isToggle={true}
            isActive={activeToggle === "JSON Parser"}
            onToggle={() => handleButtonClick("JSON Parser")}
          />

          {/* log4j Parser */}
          <MainButton
            label="Log4j Parser"
            isToggle={true}
            isActive={activeToggle === "Log4j Parser"}
            onToggle={() => handleButtonClick("Log4j Parser")}
          />

          {/* ダミーボタン */}
          <MainButton label="" isDummy={true} />

          {/* ダミーボタン */}
          {[...Array(5)].map((_, index) => (
            <MainButton
              key={index}
              label="&nbsp;"
              isDummy={true}
              onClickAction={() => handleButtonClick("")}
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