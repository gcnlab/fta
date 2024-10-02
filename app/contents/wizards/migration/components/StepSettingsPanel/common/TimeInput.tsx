// /app/contents/wizards/migration/components/StepSettingsPanel/common/TimeInput.tsx

import React from 'react';

interface TimeInputProps {
  stepId: number;
  time: number | undefined;
  onTimeChange: (value: number) => void;
}

/**
 * TimeInput コンポーネントは、所要時間を入力するフィールドを提供します。
 * @param stepId - ステップの一意のID
 * @param time - 現在の所要時間の値
 * @param onTimeChange - 所要時間が変更されたときに呼び出されるコールバック関数
 */
const TimeInput: React.FC<TimeInputProps> = ({ stepId, time, onTimeChange }) => {
  return (
    <div className="absolute top-4 right-4 flex items-center space-x-2">
      <label
        htmlFor={`time-${stepId}`}
        className="text-xs font-medium text-right"
        style={{ width: '60px' }} // 固定幅を設定して右寄せ
      >
        所要時間
      </label>
      <div className="flex items-center">
        <input
          type="number"
          id={`time-${stepId}`}
          className="px-2 py-1 text-end text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400 w-16"
          value={time || ''}
          onChange={(e) => onTimeChange(Number(e.target.value))}
          min={0}
        />
        <span className="ml-1 text-xs">分</span>
      </div>
    </div>
  );
};

export default React.memo(TimeInput);
