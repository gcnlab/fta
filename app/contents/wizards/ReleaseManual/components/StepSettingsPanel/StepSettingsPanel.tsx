// /app/contents/wizards/ReleaseManual/components/StepSettingsPanel/StepSettingsPanel.tsx

import React from 'react';
import { Step, StepDetails, StepType } from '../../types';

// 手順タイプごとのコンポーネントをインポート
import HD_BK_PRE from './steps/HD BK_PRE';
import HD_BK from './steps/HD BK';
import HD_RL from './steps/HD RL';

import CN_DB from './steps/CN_DB';
import CN_RDT from './steps/CN_RDT';
import CN_SMB from './steps/CN_SMB';

import BK_DB_OBJ from './steps/BK_DB_OBJ';
import BK_DB_DATA from './steps/BK_DB_DATA';
import BK_FILE from './steps/BK_FILE';

import RL_TOOL from './steps/RL_TOOL';
import RL_FILE from './steps/RL_FILE';
import RL_DATA from './steps/RL_DATA';
import RL_EXEC_DIRECT from './steps/RL_EXEC_DIRECT';
import RL_EXEC_USEFILE from './steps/RL_EXEC_USEFILE';

/*
RL_ADDITIONAL = 'リリース - 外部手順書使用',
*/

import FR_TX_ONE from './steps/FR_TX_ONE';
import FR_TX_MLP from './steps/FR_TX_MLP';
import RL_ADDITIONAL from './steps/RL_ADDITIONAL';

// 他の手順タイプごとのコンポーネントも同様にインポート

interface StepSettingsPanelProps {
  step: Step;
  stepNumber: number; // ステップ番号
  updateStepDetails: (updatedDetails: StepDetails) => void;
}

// ステップタイプとコンポーネントのマッピング
const stepTypeToComponentMap: Record<StepType, React.FC<any>> = {
  [StepType.HD_BK_PRE]: HD_BK_PRE,
  [StepType.HD_BK]: HD_BK,
  [StepType.HD_RL]: HD_RL,
  [StepType.CN_DB]: CN_DB,
  [StepType.CN_RDT]: CN_RDT,
  [StepType.CN_SMB]: CN_SMB,
  [StepType.BK_DB_OBJ]: BK_DB_OBJ,
  [StepType.BK_DB_DATA]: BK_DB_DATA,
  [StepType.BK_FILE]: BK_FILE,
  [StepType.RL_TOOL]: RL_TOOL,
  [StepType.RL_FILE]: RL_FILE,
  [StepType.RL_DATA]: RL_DATA,
  [StepType.RL_EXEC_DIRECT]: RL_EXEC_DIRECT,
  [StepType.RL_EXEC_USEFILE]: RL_EXEC_USEFILE,
  [StepType.RL_ADDITIONAL]: RL_ADDITIONAL,
  [StepType.FR_TX_ONE]: FR_TX_ONE,
  [StepType.FR_TX_MLP]: FR_TX_MLP,
};

// デフォルトコンポーネント
const DefaultStepSettings: React.FC = () => (
  <div className="text-xs text-gray-500">この手順の設定がありません。</div>
);

const StepSettingsPanel: React.FC<StepSettingsPanelProps> = ({
  step,
  stepNumber,
  updateStepDetails,
}) => {
  const StepComponent =
    stepTypeToComponentMap[step.name as StepType] || DefaultStepSettings;

  return (
    <div className="w-full">
      <StepComponent
        step={step}
        stepNumber={stepNumber}
        updateStepDetails={updateStepDetails}
      />
    </div>
  );
};

export default React.memo(StepSettingsPanel);

