// /app/contents/wizards/migration/components/StepSettingsPanel/steps/RL_TOOL.tsx

import React from 'react';
import { Step, StepDetails } from '../../../types';
import TimeInput from '../common/TimeInput';
import TextInput from '../common/TextInput';
import TextInput2 from '../common/TextInput2';

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
    'サービスアプリにより下記サービスを停止する。',
    'サービスアプリにより下記サービスを起動する。',
    'サービスアプリにより下記サービスを再起動する。',
  ];
  
  const targets = [
    'wlsvc gseplan_AdminServer',
    'wlsvc gios_myServer',
  ];

  const confirmations = [
    'ステータスがブランクであること',
    'ステータスが「実行中」であること',
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

      {/* Targetフィールド */}
      <TextInput2
        id={`objName-${step.id}`}
        label="Target"
        value={step.details.objName || ''}
        onChange={(value) => handleChange('objName', value)}
        placeholder="操作対象を入力してください"
        options={targets}
        defaultValue=''
      />

      {/* 確認フィールドの追加 */}
      <TextInput2
        id={`confirmation-${step.id}`}
        label="確認"
        value={step.details.confirmation || ''}
        onChange={(value) => handleChange('confirmation', value)}
        placeholder="確認事項を入力してください"
        options={confirmations}
        defaultValue=''
      />
    </div>
  );
};

export default React.memo(PanelSettings);
