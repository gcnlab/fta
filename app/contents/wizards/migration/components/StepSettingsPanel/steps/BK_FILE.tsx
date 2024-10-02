// /app/contents/wizards/migration/components/StepSettingsPanel/steps/BK_FILE.tsx

import React from 'react';
import { Step, StepDetails } from '../../../types';
import TimeInput from '../common/TimeInput';
import TextInput from '../common/TextInput';
import TextInput2 from '../common/TextInput2';
import TypeInput from '../common/TypeInput';
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
    '下記のファイルをコピーして格納先へ保存する。',
  ];

  const backupTypes = [
    'bat',
    'jar',
    'properties',
    'folder',
    '-',
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
        {stepNumber}. {step.name.replace(/^■ /, '')}
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

      {/* ファイルパス */}
      <TextInput2
        id={`srcPath-${step.id}`}
        label="ファイルパス"
        value={step.details.srcPath || ''}
        onChange={(value) => handleChange('srcPath', value)}
        placeholder="バックアップするファイルのパスを入力してください"
      />

      {/* TYPE と OBJECT フィールド */}
      <div className="flex flex-col md:flex-row md:space-x-4">
        {/* TYPE セクション */}
        <div className="w-full md:w-1/4 flex items-start">
          <TypeInput
            id={`objType-${step.id}`}
            label="TYPE"
            value={step.details.objType || ''}
            onChange={(value) => handleChange('objType', value)}
            placeholder="選択または入力"
            options={backupTypes}
            defaultValue=""//{backupTypes[0]} // デフォルト値を設定
          />
        </div>

        {/* OBJECT セクション */}
        <div className="w-full md:w-3/4 flex items-start">
          <ObjectInput
            id={`objName-${step.id}`}
            label="OBJECT"
            value={step.details.objName || ''}
            onChange={(value) => handleChange('objName', value)}
            placeholder="OBJECTを入力してください"
            defaultValue=""
          />
        </div>
      </div>

      {/* 格納先フィールドの追加 */}
      <LocationInput
        id={`dstPath-${step.id}`}
        label="格納先"
        value={step.details.dstPath || ''}
        onChange={(value) => handleChange('dstPath', value)}
        placeholder="格納先を入力してください"
        defaultValue=""
      />
    </div>
  );
};

export default React.memo(PanelSettings);
