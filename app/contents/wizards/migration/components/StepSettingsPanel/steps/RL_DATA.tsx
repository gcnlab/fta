// /app/contents/wizards/migration/components/StepSettingsPanel/steps/RL_DATA.tsx

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
    '下記テーブルを編集内容に従い編集する。',
  ];
  
  const confirmations = [
    'コピーしたファイル数が想定通りであること',
    'コピー後のフォルダのファイル数が想定通りであること',
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
        defaultValue={directions[0]}//{directions[0]}//"下記をスクリプト出力して格納先へ保存する。"
      />

      {/* 対象テーブル入力 */}
      <ObjectInput
        id={`objName-${step.id}`}
        label="対象テーブル"
        value={step.details.objName || ''}
        onChange={(value) => handleChange('objName', value)}
        placeholder='対象テーブルを入力してください'
        defaultValue=''
      />

      {/* 記述フィールドの追加 */}
      <LocationInput
        id={`description-${step.id}`}
        label="編集内容"
        value={step.details.description || ''}
        onChange={(value) => handleChange('description', value)}
        placeholder="編集内容を入力してください"
      />

      {/* 確認フィールドの追加 */}
      <LocationInput
        id={`confirmation-${step.id}`}
        label="確認事項"
        value={step.details.confirmation || ''}
        onChange={(value) => handleChange('confirmation', value)}
        placeholder="確認事項を入力してください"
      />

    </div>
  );
};

export default React.memo(PanelSettings);
