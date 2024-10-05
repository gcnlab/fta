// /app/contents/wizards/ReleaseManual/components/StepSettingsPanel/common/TextInput.tsx

import React, { useState, useRef, useEffect } from 'react';

interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  options?: string[]; // 定型文の配列
  isTitleBar?: boolean;
  type?: 'text' | 'select';
  defaultValue?: string | number;
}

/**
 * TextInput コンポーネントは、ラベル付きのテキスト入力フィールドと、
 * プルダウンで定型文を選択できる機能を提供します。
 *
 * @param id - input要素のID
 * @param label - フィールドのラベル
 * @param value - 現在の入力値
 * @param onChange - 入力値が変更されたときに呼び出されるコールバック関数
 * @param placeholder - プレースホルダー文字列
 * @param className - 追加のCSSクラス
 * @param options - プルダウンで選択可能な定型文の配列
 * @param isTitleBar - タイトルバーとして使用するかどうか
 * @param type - 入力タイプ ('text' または 'select')
 * @param defaultValue - デフォルト値
 */
const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  className = '',
  options = [],
  isTitleBar = false,
  type = 'text',
  defaultValue = '',
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);

  // 初回レンダリング時にデフォルト値を設定
  useEffect(() => {
    if (!value && defaultValue !== undefined) {
      onChange(String(defaultValue));
    }
  }, [defaultValue, onChange, value]);

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setShowOptions(false);
  };

  // 外部クリックでプルダウンを閉じるためのリファレンス
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 背景色のクラスを条件に応じて設定
  const backgroundClass = isTitleBar ? 'bg-yellow-200' : 'bg-pink-50';

  return (
    <div className={`mb-4 ${className}`} ref={wrapperRef}>
      <label htmlFor={id} className="block text-xs font-medium mb-0.5 text-left">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id={id}
          className={`w-full px-2 py-1 text-xs ${backgroundClass} border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={type === 'select'} // 選択のみの場合は読み取り専用にする
          onClick={() => {
            if (type === 'select') {
              setShowOptions(!showOptions);
            }
          }}
        />
        {options.length > 0 && (
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 px-1 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {/* ドロップダウンのアイコン */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </button>
        )}
        {showOptions && (
          <ul
            className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-sm shadow-lg overflow-auto"
            style={{ maxHeight: '10rem' }} // コンパクトにするための高さ制限
          >
            {options.map((option, index) => (
              <li
                key={`${id}-option-${index}`}
                className="px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default React.memo(TextInput);

