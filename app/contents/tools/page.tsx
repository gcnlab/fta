// /app/contents/tools/page.tsx

"use client";

import { MainButton } from "@/app/components/MainButton";
import { useState, useEffect } from 'react';
import { WhitePanel } from "@/app/components/WhitePanel";
import TimeZoneViewer from "./components/TimeZoneViewer";
import FileUpload from "./components/FileUpload";
import SumUp from "./components/SumUp";
import DBTest from "./components/DBTest";

export default function Page() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [activeToggle, setActiveToggle] = useState<string | null>(null);
  const SELECTED_TOOL_KEY = 'selectedToolTools';

  const handleButtonClick = (toolName: string) => {
    if (activeToggle === toolName) {
      setActiveToggle(null);
      setSelectedTool(null);
      localStorage.removeItem(SELECTED_TOOL_KEY);
    } else {
      setActiveToggle(toolName);
      setSelectedTool(toolName);
      localStorage.setItem(SELECTED_TOOL_KEY, toolName);
    }
  };

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
          <MainButton
            label="Time Zone"
            isToggle={true}
            isActive={activeToggle === "Time Zone"}
            onToggle={() => handleButtonClick("Time Zone")}
          />
          <MainButton
            label="JSON Parser"
            isToggle={true}
            isActive={activeToggle === "JSON Parser"}
            onToggle={() => handleButtonClick("JSON Parser")}
          />
          <MainButton
            label="Log4j Parser"
            isToggle={true}
            isActive={activeToggle === "Log4j Parser"}
            onToggle={() => handleButtonClick("Log4j Parser")}
          />
          <MainButton
            label="受払計算シミュレータ"
            isToggle={true}
            isDummy={true}
            isActive={activeToggle === "受払計算シミュレータ"}
            onToggle={() => handleButtonClick("受払計算シミュレータ")}
          />
          <MainButton
            label="原単位計算シミュレータ"
            isToggle={true}
            isDummy={true}
            isActive={activeToggle === "原単位計算シミュレータ"}
            onToggle={() => handleButtonClick("原単位計算シミュレータ")}
          />

          <MainButton
            label="Sum Up"
            isToggle={true}
            isActive={activeToggle === "Sum Up"}
            onToggle={() => handleButtonClick("Sum Up")}
          />

          <MainButton
            label="File Upload"
            isToggle={true}
            isActive={activeToggle === "File Upload"}
            onToggle={() => handleButtonClick("File Upload")}
          />

          <MainButton
            label="DB Test"
            isToggle={true}
            isActive={activeToggle === "DB Test"}
            onToggle={() => handleButtonClick("DB Test")}
          />

          {/* ダミーボタン */}
          <MainButton label="" isDummy={true} />

          {/* ダミーボタン (8つ) */}
          {[...Array(1)].map((_, index) => (
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
          {selectedTool === "Time Zone" ? (
            <WhitePanel height="360px">
              <TimeZoneViewer />
            </WhitePanel>
          ) : selectedTool === "Sum Up" ? (
            <WhitePanel height="360px">
              <SumUp />
            </WhitePanel>
          ) : selectedTool === "File Upload" ? (
            <WhitePanel height="360px">
              <FileUpload />
            </WhitePanel>
          ) : selectedTool === "DB Test" ? (
            <WhitePanel height="360px">
              <DBTest />
            </WhitePanel>
          ) : (
            selectedTool && (
              <WhitePanel height="360px">
                <h2 className="text-sm font-semibold text-gray-700">{selectedTool}</h2>
                <p className="text-xs text-gray-600 mt-1">{selectedTool}のコンテンツです。</p>
              </WhitePanel>
            )
          )}
        </div>
      </div>
    </main>
  );
}
