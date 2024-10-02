// /app/contents/wizards/migration/components/StepSettingsPanel/steps/FR_TX_MLP.tsx

import React, { useState } from 'react';
import { Step, StepDetails } from '../../../types';
import TimeInput from '../common/TimeInput';
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

  return (
    <div className="p-4 bg-orange-50 rounded-md border border-gray-300 shadow-md relative">
      {/* タイトル */}
      <h3 className="text-sm font-medium mb-4">
        {stepNumber}. {step.name}
      </h3>

      {/* 追加入力フィールド */}
      <LocationInput
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
