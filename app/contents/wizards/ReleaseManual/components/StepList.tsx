// /app/contents/wizards/ReleaseManual/components/StepList.tsx

import React from 'react';
import { Step } from '../types';

interface StepListProps {
  steps: Step[];
  activeStepIndex: number | null;
  setActiveStepIndex: React.Dispatch<React.SetStateAction<number | null>>;
  moveStep: (direction: number) => void;
  deleteStep: () => void;
}

const StepList: React.FC<StepListProps> = ({
  steps,
  activeStepIndex,
  setActiveStepIndex,
  moveStep,
  deleteStep,
}) => {
  return (
    <div className="p-2 border border-gray-300 rounded-md bg-white">
      {/* リストの表示パネル */}
      {steps.length === 0 ? (
        <p className="text-xs text-gray-500">リストはまだ追加されていません。</p>
      ) : (
        steps.map((step, index) => (
          <div
            key={step.id} // 一意のIDを使用
            className={`flex items-center justify-between mb-1 px-1 py-0 rounded cursor-pointer ${
              activeStepIndex === index ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
            onClick={() => setActiveStepIndex(index)}
          >
            <span className="text-xs">{`${index + 1}. ${step.name}`}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default React.memo(StepList);

