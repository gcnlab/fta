// /app/contents/wizards/ReleaseManual/components/StepSettingsPanel/steps/BK_CMD.tsx

import React from 'react';
import { Step, StepDetails } from '../../../types';
import TextInput from '../common/TextInput';
import TimeInput from '../common/TimeInput';

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
      />

      {/* コマンド */}
      <TextInput
        id={`script-${step.id}`}
        label="コマンド"
        value={step.details.script || ''}
        onChange={(value) => handleChange('script', value)}
        placeholder="実行するコマンドを入力してください"
      />
    </div>
  );
};

export default React.memo(PanelSettings);

