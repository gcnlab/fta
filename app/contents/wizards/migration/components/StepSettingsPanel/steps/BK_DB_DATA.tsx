// /app/contents/wizards/migration/components/StepSettingsPanel/steps/BK_DB_DATA.tsx

import React from 'react';
import { Step, StepDetails } from '../../../types';
import TimeInput from '../common/TimeInput';
import TextInput from '../common/TextInput';
import ObjectInput from '../common/ObjectInput';
import LocationInput from '../common/LocationInput';

interface IfProps {
  step: Step;
  stepNumber: number;
  updateStepDetails: (updatedDetails: StepDetails) => void;
}

const PanelSettings: React.FC<IfProps> = ({
  step,
  stepNumber,
  updateStepDetails,
}) => {
  const handleChange = (field: keyof StepDetails, value: any) => {
    updateStepDetails({
      ...step.details,
      [field]: value,
    });
  };

  const directions = [
    '下記テーブルのデータをEXCEL出力して格納先へ保存する。',
    '下記テーブルのデータをクリップボードに出力して所定のファイルへ貼り付ける。',
  ];

  return (
    <div className="p-4 bg-orange-50 rounded-md border border-gray-300 shadow-md relative">
      {/* 所要時間 */}
      <TimeInput
        stepId={step.id}
        time={step.details.duration}
        onTimeChange={(value) => handleChange('duration', value)}
      />

      {/* タイトル */}
      <h3 className="text-sm font-medium mb-4">
        {stepNumber}. {step.name}
      </h3>

      {/* 作業指示 */}
      <TextInput
        id={`direction-${step.id}`}
        label="作業指示"
        value={step.details.direction || ''}
        onChange={(value) => handleChange('direction', value)}
        placeholder="作業指示を入力してください"
        options={directions}
        defaultValue={directions[0]} // デフォルト値を設定
      />

      {/* 対象テーブル入力 */}
      <ObjectInput
        id={`objName-${step.id}`}
        label="対象テーブル"
        value={step.details.objName || ''}
        onChange={(value) => handleChange('objName', value)}
        placeholder="対象テーブルを入力してください"
        defaultValue="" // 必要に応じてデフォルト値を設定
      />

      {/* 格納先フィールドの追加 */}
      <LocationInput
        id={`dstPath-${step.id}`}
        label="格納先"
        value={step.details.dstPath || ''}
        onChange={(value) => handleChange('dstPath', value)}
        placeholder="格納先を入力してください"
        defaultValue="" // 必要に応じてデフォルト値を設定
      />
    </div>
  );
};

export default React.memo(PanelSettings);
