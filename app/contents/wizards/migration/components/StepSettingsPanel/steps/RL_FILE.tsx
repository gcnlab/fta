// /app/contents/wizards/migration/components/StepSettingsPanel/steps/RL_FILE.tsx

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
    '下記ファイルを移送先へコピーする。',
    '移送先の下記ファイルを削除する',
  ];
  
  const objTypes = [
    'bat',
    'jar',
    'properties',
    'folder',
    '-',
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
        defaultValue=''//{directions[0]}//"下記をスクリプト出力して格納先へ保存する。"
      />

      {/* コピー元フィールドの追加 */}
      <LocationInput
        id={`srcPath-${step.id}`}
        label="移送元格納場所"
        value={step.details.srcPath || ''}
        onChange={(value) => handleChange('srcPath', value)}
        placeholder="移送元ファイルの格納場所を入力してください"
        defaultValue="" // 必要に応じてデフォルト値を設定
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
            options={objTypes}
            defaultValue=""
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

      {/* 移送先フィールドの追加 */}
      <TextInput2
        id={`dstPath-${step.id}`}
        label="移送先"
        value={step.details.dstPath || ''}
        onChange={(value) => handleChange('dstPath', value)}
        placeholder="移送先のPathを入力してください"
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
