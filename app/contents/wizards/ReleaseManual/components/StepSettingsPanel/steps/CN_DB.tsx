// /app/contents/wizards/ReleaseManual/components/StepSettingsPanel/steps/CN_DB.tsx

import React, { useState } from 'react';
import { Step, StepDetails } from '../../../types';
import TimeInput from '../common/TimeInput';
import TextInput from '../common/TextInput';
import TextInput2 from '../common/TextInput2';
import UserInput from '../common/UserInput';
import PasswordInput from '../common/PasswordInput';

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
    'ObjectBrowserで下記へ接続する。',
    'SQLPlusで下記へ接続する。',
  ];

  const users = [ 'ETL', 'GSEPLAN', 'GIOS', ]

  const SIDs = [ 'GSEPLAN', 'GIOS', ]

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
        defaultValue={directions[0]}//"下記をスクリプト出力して格納先へ保存する。"
      />

      {/* USERとPASSWORD */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
        <UserInput
          id={`user-${step.id}`}
          value={step.details.user || ''}
          onChange={(value) => handleChange('user', value)}
          options={users}
          defaultValue=''
        />
        <PasswordInput
          id={`password-${step.id}`}
          value={step.details.password || ''}
          onChange={(value) => handleChange('password', value)}
        />
      </div>

      {/* SIDフィールド */}
      <TextInput2
        id={`connectTo-${step.id}`}
        label="SID"
        value={step.details.connectTo || ''}
        onChange={(value) => handleChange('connectTo', value)}
        placeholder="SIDを入力してください"
        options={SIDs}
        defaultValue=''
      />
    </div>
  );
};

export default React.memo(PanelSettings);

