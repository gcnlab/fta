// /app/contents/wizards/ReleaseManual/components/CustomDropdown/SubStepItem.tsx

import React from 'react';

interface SubStepItemProps {
  step: string;
  isSelected: boolean;
  onClick: () => void;
}

const SubStepItem: React.FC<SubStepItemProps> = ({
  step,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-1 text-xs ${
        isSelected ? 'bg-blue-100' : 'bg-blue-50'
      } hover:bg-gray-100`}
    >
      {step}
    </button>
  );
};

export default React.memo(SubStepItem);

