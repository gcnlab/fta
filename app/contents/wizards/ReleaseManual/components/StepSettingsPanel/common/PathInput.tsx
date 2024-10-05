// /app/contents/wizards/ReleaseManual/components/StepSettingsPanel/common/PathInput.tsx

import React, { useState, useRef, useEffect } from 'react';

interface PathInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string, handle?: FileSystemDirectoryHandle | null) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean; // フォルダ選択のみの場合は読み取り専用
}

/**
 * PathInput コンポーネントは、ラベル付きのテキスト入力フィールドと、
 * フォルダ選択ダイアログを開くためのアイコンを提供します。
 *
 * @param id - input要素のID
 * @param label - フィールドのラベル
 * @param value - 現在の入力値
 * @param onChange - 入力値が変更されたときに呼び出されるコールバック関数
 * @param placeholder - プレースホルダー文字列
 * @param className - 追加のCSSクラス
 * @param readOnly - テキスト入力を読み取り専用にするかどうか
 */
const PathInput: React.FC<PathInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  className = '',
  readOnly = false,
}) => {
  const [isFolderPickerSupported, setIsFolderPickerSupported] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // File System Access API のサポートを確認
    setIsFolderPickerSupported('showDirectoryPicker' in window);
  }, []);

  const handleFolderSelect = async () => {
    if (!isFolderPickerSupported) {
      alert('お使いのブラウザはフォルダ選択機能をサポートしていません。最新のChromeやEdgeをお試しください。');
      return;
    }

    try {
      // フォルダ選択ダイアログを表示
      const directoryHandle: FileSystemDirectoryHandle = await (window as any).showDirectoryPicker();
      // フォルダの名前を取得
      const folderName = directoryHandle.name;
      // フォルダハンドルを渡す
      onChange(folderName, directoryHandle);
    } catch (error) {
      if (error instanceof Error) { // 型ガードを使用
        if (error.name !== 'AbortError') {
          console.error('フォルダ選択中にエラーが発生しました:', error);
          alert('フォルダ選択中にエラーが発生しました。');
        }
      } else {
        console.error('予期しないエラーが発生しました:', error);
        alert('フォルダ選択中に予期しないエラーが発生しました。');
      }
      // ユーザーが選択をキャンセルした場合は何もしない
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-xs font-medium mb-0.5 text-left">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id={id}
          ref={inputRef}
          className={`w-full px-2 py-1 text-xs bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400`}
          value={value}
          onChange={(e) => onChange(e.target.value, null)} // ハンドルはクリア
          placeholder={placeholder}
          readOnly={readOnly}
        />
        <button
          type="button"
          onClick={handleFolderSelect}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="フォルダ選択"
        >
          {/* フォルダ選択アイコン（例としてSVGのフォルダアイコン） */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
        </button>
      </div>
      {!isFolderPickerSupported && (
        <p className="text-xs text-red-500 mt-1">
          フォルダ選択機能はこのブラウザではサポートされていません。
        </p>
      )}
    </div>
  );
};

export default React.memo(PathInput);

