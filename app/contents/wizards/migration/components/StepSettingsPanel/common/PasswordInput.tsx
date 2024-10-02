// /app/contents/wizards/migration/components/StepSettingsPanel/common/PasswordInput.tsx

import React, { useState, useEffect } from 'react';

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

/**
 * PasswordInput コンポーネントは、パスワードの入力フィールドを提供します。
 * パスワードの表示/非表示を切り替えることができます。
 *
 * @param id - input要素のID
 * @param value - 現在のパスワード
 * @param onChange - パスワードが変更されたときに呼び出されるコールバック関数
 * @param defaultValue - デフォルトのパスワード
 */
const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  value,
  onChange,
  defaultValue = '',
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // 初回レンダリング時にデフォルト値を設定
  useEffect(() => {
    if (!value && defaultValue) {
      onChange(defaultValue);
    }
  }, [defaultValue, onChange, value]);

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="block text-xs font-medium mb-1">
        Password
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          autoComplete="new-password"
          className="px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400 pr-8"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="パスワードを入力"
        />
        {/* パスワード表示/非表示トグルボタン */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {showPassword ? (
            // 目を閉じたアイコン（SVG）
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {/* SVG path for closed eye */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10..."
              />
            </svg>
          ) : (
            // 目を開いたアイコン（SVG）
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {/* SVG path for open eye */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5..."
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default React.memo(PasswordInput);
