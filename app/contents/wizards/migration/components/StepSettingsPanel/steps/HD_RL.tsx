// /app/contents/wizards/migration/components/StepSettingsPanel/steps/HD_RL.tsx

import React from 'react';
import { Step, StepDetails } from '../../../types';
import TextInput from '../common/TextInput';

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

  const getHeadingText = () => {
    if (step.details.title) {
      return step.details.title;
    }
    // デフォルトでstep.nameから「■ 」を除去
    return step.name.replace(/^■ /, '');
  };

  return (
    <div className="p-4 bg-orange-50 rounded-md border border-gray-300 shadow-md relative">
      {/* タイトル */}
      <h3 className="text-sm font-medium mb-4">
        {stepNumber}. {step.name.replace(/^■ /, '')}
      </h3>

      {/* TitleBarテキスト */}
      <TextInput
        id={`title-${step.id}`}
        label="タイトルバーテキスト"
        value={getHeadingText()}
        onChange={(value) => handleChange('title', value)}
        placeholder="タイトルバーのテキストを入力してください"
        isTitleBar={true}
      />
    </div>
  );
};

export default React.memo(PanelSettings);
