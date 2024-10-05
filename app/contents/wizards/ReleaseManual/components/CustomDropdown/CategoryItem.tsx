// /app/contents/wizards/ReleaseManual/components/CustomDropdown/CategoryItem.tsx

import React from 'react';
import { Category } from '../../types';

interface CategoryItemProps {
  category: Category;
  onClick: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-1 text-xs bg-green-50 hover:bg-green-100"
    >
      {category.name}
    </button>
  );
};

export default React.memo(CategoryItem);

