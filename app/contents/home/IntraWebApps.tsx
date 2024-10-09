// /app/contents/home/IntraWebApp.tsx

'use client';

import React from 'react';
import data from './data/intraWebAppsData.json';

interface ButtonData {
  label: string;
  url: string;
  shiftUrl: string | null;
}

interface CategoryData {
  category: string;
  heading: string;
  buttons: ButtonData[];
}

export default function IntraWebApp() {
  // 各カテゴリを個別に取得
  const specialCategory = data.find((category: CategoryData) => category.category === "SPECIAL");
  const gseCategory = data.find((category: CategoryData) => category.category === "INTRA1");
  const gioCategory = data.find((category: CategoryData) => category.category === "INTRA2");
  const submissionCategory = data.find((category: CategoryData) => category.category === "INTRA3");
  const mailCategory = data.find((category: CategoryData) => category.category === "INTRA4");

  return (
    <div className="p-8 border border-gray-600 min-w-[500px] min-h-[250px] bg-transparent relative flex-shrink-0">
      <h2 className="text-lg font-semibold text-gray-100 mb-4 whitespace-nowrap">Intra Web Apps</h2>

      {/* SPECIAL カテゴリのボタン（GitLab） */}
      {specialCategory && specialCategory.buttons.map((button, index) => (
        <div key={`special-${index}`} className="absolute top-0 right-0 p-8">
          <button className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-28 text-center whitespace-nowrap">
            <a href={button.url} target="_blank" rel="noopener noreferrer">{button.label}</a>
          </button>
        </div>
      ))}

      {/* Shift+Click の説明 */}
      <p className="text-gray-400 mb-2 text-xs text-end whitespace-nowrap">Shift+Click for Console</p>

      {/* GSE開発 セクション */}
      {gseCategory && (
        <div className="flex items-center mb-2">
          <h3 className="text-end text-sm font-semibold text-gray-100 mr-2 w-20 whitespace-nowrap">{gseCategory.heading}</h3>
          <div className="grid grid-cols-4 gap-2 w-full">
            {gseCategory.buttons.map((button, index) => (
              <button
                key={`gse-${index}`}
                className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center whitespace-nowrap"
                onClick={(e) => {
                  if (button.shiftUrl) {
                    if (e.shiftKey) {
                      window.open(button.shiftUrl, "_blank");
                    } else {
                      window.open(button.url, "_blank");
                    }
                  } else {
                    window.open(button.url, "_blank");
                  }
                }}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GIO開発 セクション */}
      {gioCategory && (
        <div className="flex items-center mb-2">
          <h3 className="text-end text-sm font-semibold text-gray-100 mr-2 w-20 whitespace-nowrap">{gioCategory.heading}</h3>
          <div className="grid grid-cols-4 gap-2 w-full">
            {gioCategory.buttons.map((button, index) => (
              <button
                key={`gio-${index}`}
                className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center whitespace-nowrap"
                onClick={(e) => {
                  if (button.shiftUrl) {
                    if (e.shiftKey) {
                      window.open(button.shiftUrl, "_blank");
                    } else {
                      window.open(button.url, "_blank");
                    }
                  } else {
                    window.open(button.url, "_blank");
                  }
                }}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <hr className="border-gray-700" style={{ width: '90%', margin: '8px auto' }} />

      {/* 申請 セクション */}
      {submissionCategory && (
        <div className="flex items-center mb-2">
          <h3 className="text-end text-sm font-semibold text-gray-100 mr-2 w-20 whitespace-nowrap">{submissionCategory.heading}</h3>
          <div className="grid grid-cols-2 gap-2 w-full">
            {submissionCategory.buttons.map((button, index) => (
              <button
                key={`submission-${index}`}
                className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-0.5 rounded w-full text-center whitespace-nowrap"
                onClick={() => window.open(button.url, "_blank")}
              >
                <a href={button.url} target="_blank" rel="noopener noreferrer">
                  {button.label}
                </a>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mail セクション */}
      {mailCategory && (
        <div className="flex items-center mb-2">
          <h3 className="text-end text-sm font-semibold text-gray-100 mr-2 w-20 whitespace-nowrap">{mailCategory.heading}</h3>
          <div className="grid grid-cols-2 gap-2 w-full">
            {mailCategory.buttons.map((button, index) => (
              <button
                key={`mail-${index}`}
                className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-0.5 rounded w-full text-center whitespace-nowrap"
                onClick={() => window.open(button.url, "_blank")}
              >
                <a href={button.url} target="_blank" rel="noopener noreferrer">
                  {button.label}
                </a>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
