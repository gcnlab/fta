// /app/contents/wizards/migration/components/StepSettingsPanel/steps/RL_EXEC_USEFILE.tsx

import React from 'react';
import { Step, StepDetails } from '../../../types';
import TimeInput from '../common/TimeInput';
import TextInput from '../common/TextInput';
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
    '下記スクリプトをObjectBrowserで実行する。',
    '下記コマンドををコマンドプロンプトで実行する。',
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
        defaultValue=''//{directions[0]}//"下記をスクリプト出力して格納先へ保存する。"
      />

      {/* スクリプト格納場所フィールドの追加 */}
      <LocationInput
        id={`srcPath-${step.id}`}
        label="スクリプトファイルの格納場所"
        value={step.details.srcPath || ''}
        onChange={(value) => handleChange('srcPath', value)}
        placeholder="スクリプトファイルの格納場所を入力してください"
      />

      {/* スクリプトフィールドの追加 */}
      <LocationInput
        id={`script-${step.id}`}
        label="スクリプトファイル"
        value={step.details.script || ''}
        onChange={(value) => handleChange('script', value)}
        placeholder="スクリプトファイル名を入力してください"
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
