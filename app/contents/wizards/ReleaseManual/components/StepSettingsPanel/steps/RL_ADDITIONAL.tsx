// /app/contents/wizards/ReleaseManual/components/StepSettingsPanel/steps/RL_ADDITIONAL.tsx

import React, { useState } from 'react';
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
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (field: keyof StepDetails, value: any) => {
    updateStepDetails({
      ...step.details,
      [field]: value,
    });
  };

  const directions = [
    '下記の外部手順書により作業を実施する。',
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
        defaultValue={directions[0]}
      />
      {/* 追加入力フィールド */}
      <LocationInput
        id={`additional-${step.id}`}
        label="外部手順書"
        value={step.details.additional || ''}
        onChange={(value) => handleChange('additional', value)}
        placeholder="外部手順書のPathを入力してください"
      />
    </div>
  );
};

export default React.memo(PanelSettings);

