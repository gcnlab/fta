// /app/contents/wizards/ReleaseManual/components/StepSettingsPanel/common/ObjectInput.tsx

import React, { useEffect } from 'react';

interface ObjectInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

/**
 * ObjectInput コンポーネントは、OBJECT フィールドの入力フィールドを提供します。
 *
 * @param id - textarea要素のID
 * @param label - フィールドのラベル
 * @param value - 現在の値
 * @param onChange - 値が変更されたときに呼び出されるコールバック関数
 * @param placeholder - プレースホルダー文字列
 * @param defaultValue - デフォルト値
 */
const ObjectInput: React.FC<ObjectInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  defaultValue = '',
}) => {
  // 初回レンダリング時にデフォルト値を設定
  useEffect(() => {
    if (!value && defaultValue) {
      onChange(defaultValue);
    }
  }, [defaultValue, onChange, value]);

  return (
    <div className="mt-0 w-2/3">
      <label htmlFor={id} className="block text-xs font-medium mb-0.5">
        {label}
      </label>
      <textarea
        id={id}
        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
      />
    </div>
  );
};

export default React.memo(ObjectInput);

