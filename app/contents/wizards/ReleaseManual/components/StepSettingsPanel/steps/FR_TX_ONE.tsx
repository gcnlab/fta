// /app/contents/wizards/ReleaseManual/components/StepSettingsPanel/steps/FR_TX_ONE.tsx

import React, { useState } from 'react';
import { Step, StepDetails } from '../../../types';
import TimeInput from '../common/TimeInput';
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
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (field: keyof StepDetails, value: any) => {
    updateStepDetails({
      ...step.details,
      [field]: value,
    });
  };

  return (
    <div className="p-4 bg-orange-50 rounded-md border border-gray-300 shadow-md relative">
      {/* タイトル */}
      <h3 className="text-sm font-medium mb-4">
        {stepNumber}. {step.name}
      </h3>

      {/* 追加入力フィールド */}
      <TextInput2
        id={`additional-${step.id}`}
        label=""
        value={step.details.additional || ''}
        onChange={(value) => handleChange('additional', value)}
        placeholder="追加事項を入力してください"
      />
    </div>
  );
};

export default React.memo(PanelSettings);

