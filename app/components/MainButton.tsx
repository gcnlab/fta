// /app/components/MainButton.tsx

"use client";

import React from 'react';
import { useRouter } from "next/navigation";

interface MainButtonProps {
  label: string;
  onClickAction?: () => void;  // オプション：クリック時に実行される関数
  isDummy?: boolean;           // オプション：ダミーモードかどうか
  isToggle?: boolean;          // オプション：トグルボタンかどうか
  isActive?: boolean;          // オプション：トグルボタンがアクティブかどうか
  onToggle?: () => void;       // オプション：トグル状態が変わった時の関数
  isNavigation?: boolean;      // オプション：ナビゲーションボタンかどうか
}

export const MainButton: React.FC<MainButtonProps> = ({
  label,
  onClickAction,
  isDummy = false,
  isToggle = false,
  isActive = false,
  onToggle,
  isNavigation = false,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (isDummy) {
      alert("This page is under construction...");
    } else if (isToggle) {
      if (onToggle) {
        onToggle();  // トグルアクションを実行
      }
    } else if (onClickAction) {
      onClickAction();  // 指定されたアクションを実行
    } else {
      //router.push('/contents/wizards/ReleaseManual');  // デフォルトの画面遷移
    }
  };

  return (
    <button
      className={`relative ${
        isDummy
          ? 'bg-gray-200 text-gray-700 border border-gray-300 cursor-not-allowed'  // ダミーモードのスタイル
          : isToggle
            ? `bg-gray-50 text-gray-900 border ${
                isActive ? 'border-gray-700 bg-gray-100 scale-95' : 'border-blue-900'
              }`  // トグルボタンのスタイル（控えめなアクティブ時のスタイルと縮小効果）
            : isNavigation
              ? 'rounded-xl bg-gray-50 text-blue-950 border border-blue-950 shadow-sm'  // ナビゲーションボタンのスタイル
              : 'bg-gray-50 text-gray-900 border border-blue-900'  // デフォルトスタイル
      } h-6 shadow-sm rounded-md py-0.5 px-3 text-xs font-medium transition-transform duration-100 ease-in-out
      hover:translate-x-0.5 hover:translate-y-0.5 focus:outline-none ${
        !isDummy && 'hover:bg-gray-100 hover:shadow-md'  // ダミーでない場合のホバースタイル
      }`}
      onClick={handleClick}
      disabled={isDummy}
      aria-pressed={isToggle ? isActive : undefined}  // アクセシビリティ属性
    >
      {/* トグルボタンがアクティブな場合に左右に●を表示 */}
      {isToggle && isActive && (
        <>
          <span className="absolute left-1.5 top-1/2 transform -translate-y-1/2 h-1.5 w-1.5 bg-gray-500 rounded-full"></span>
          <span className="absolute right-1.5 top-1/2 transform -translate-y-1/2 h-1.5 w-1.5 bg-gray-500 rounded-full"></span>
        </>
      )}
      {label}
    </button>
  );
};

