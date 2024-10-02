// /app/contents/wizards/migration/components/StepSettingsPanel/common/TypeInput.tsx

import React, { useState, useRef, useEffect } from 'react';

interface TypeInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: string[];
  defaultValue?: string;
}

/**
 * TypeInput コンポーネントは、TYPE フィールドの入力と選択を提供します。
 *
 * @param id - input要素のID
 * @param label - フィールドのラベル
 * @param value - 現在の値
 * @param onChange - 値が変更されたときに呼び出されるコールバック関数
 * @param placeholder - プレースホルダー文字列
 * @param options - 選択可能なオプションの配列
 * @param defaultValue - デフォルト値
 */
const TypeInput: React.FC<TypeInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  options,
  defaultValue = '',
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setShowOptions(false);
  };

  // 外部クリックでプルダウンを閉じるためのリファレンス
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 初回レンダリング時にデフォルト値を設定
  useEffect(() => {
    if (!value && defaultValue) {
      onChange(defaultValue);
    }
  }, [defaultValue, onChange, value]);

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

  return (
    <div className="mb-4" ref={wrapperRef}>
      <label htmlFor={id} className="block text-xs font-medium mb-0.5 text-left">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id={id}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onClick={() => setShowOptions(!showOptions)}
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

export default React.memo(TypeInput);
