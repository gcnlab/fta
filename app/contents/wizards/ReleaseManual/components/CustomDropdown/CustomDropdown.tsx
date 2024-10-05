// /app/contents/wizards/ReleaseManual/components/CustomDropdown/CustomDropdown.tsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import CategoryItem from './CategoryItem';
import SubStepItem from './SubStepItem';
import { Category } from '../../types';

interface CustomDropdownProps {
  categories: Category[];
  onSelect: (selectedStep: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ categories, onSelect }) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [currentMenu, setCurrentMenu] = useState<'category' | 'subStep'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubStep, setSelectedSubStep] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // ドロップダウン外をクリックしたら閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
        resetDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoryClick = useCallback((categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentMenu('subStep');
  }, []);

  const handleSubStepClick = useCallback((subStep: string) => {
    setSelectedSubStep(subStep);
  }, []);

  const handleAdd = useCallback(() => {
    if (selectedSubStep) {
      onSelect(selectedSubStep);
      setDropdownOpen(false); // プルダウンを閉じる
      resetDropdown();
    }
  }, [onSelect, selectedSubStep]);

  const handleBack = useCallback(() => {
    setCurrentMenu('category');
    setSelectedCategory('');
    setSelectedSubStep('');
  }, []);

  const toggleDropdown = () => {
    const newDropdownOpen = !dropdownOpen;
    setDropdownOpen(newDropdownOpen);
    if (newDropdownOpen) {
      // ドロップダウンを開く際に初期状態にリセット
      resetDropdown();
    }
  };

  const resetDropdown = () => {
    setCurrentMenu('category');
    setSelectedCategory('');
    setSelectedSubStep('');
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="w-full px-3 py-0 text-xs border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none text-left"
        aria-haspopup="listbox"
        aria-expanded={dropdownOpen}
      >
        {selectedSubStep ? selectedSubStep : '選択して追加ボタンを押してください'}
      </button>

      {dropdownOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {/* スクロール可能なリストをラップ */}
          <div className="max-h-48 overflow-y-auto">
            {/* 第1階層: カテゴリ */}
            {currentMenu === 'category' &&
              categories.map((category, index) => (
                <CategoryItem
                  key={index}
                  category={category}
                  onClick={() => handleCategoryClick(category.name)}
                />
              ))}

            {/* 第2階層: サブステップ */}
            {currentMenu === 'subStep' &&
              selectedCategory &&
              categories
                .find((cat) => cat.name === selectedCategory)
                ?.subSteps.map((step, index) => (
                  <SubStepItem
                    key={index}
                    step={step}
                    isSelected={selectedSubStep === step}
                    onClick={() => handleSubStepClick(step)}
                  />
                ))}
          </div>

          {/* 固定表示の「戻る」と「追加」ボタン */}
          {currentMenu === 'subStep' && selectedCategory && (
            <div className="border-t border-gray-200">
              {/* 戻るボタン */}
              <button
                onClick={handleBack}
                className="w-full text-left px-3 py-1 text-xs bg-white hover:bg-gray-100"
              >
                ◀ 戻る
              </button>

              {/* 追加ボタン */}
              <button
                onClick={handleAdd}
                className={`w-full px-3 py-1 text-xs ${
                  selectedSubStep
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                } rounded-b-md`}
                disabled={!selectedSubStep}
              >
                追加
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(CustomDropdown);

