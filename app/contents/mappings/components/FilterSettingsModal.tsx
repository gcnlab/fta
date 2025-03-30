import React, { useState, useMemo } from 'react';
import { MappingData } from '../types';

export interface FilterCondition {
  id: number;
  columnIndex: number;
  // チェックボックス選択した値（複数選択の場合は論理和）。テキスト入力がある場合は無視。
  value: string[];
  // ユーザが直接入力したフィルタ文字列（入力があればテキストによる部分一致フィルタ）
  inputValue: string;
}

interface FilterSettingsModalProps {
  onClose: () => void;
  onSave: (filters: FilterCondition[]) => void;
  fileContent: string;
  mappingData: MappingData;
  initialFilters?: FilterCondition[];
}

interface FilterDropdownProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ options, selected, onChange }) => {
  const [open, setOpen] = useState<boolean>(false);
  const toggleOpen = () => setOpen(!open);
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={toggleOpen}
        style={{ width: '30ch' }}
        className="px-2 py-1 border rounded text-xs"
      >
        {selected.length > 0 ? selected.join(', ') : '(チェックボックス)'}
      </button>
      {open && (
        <div className="absolute z-10 bg-white border rounded mt-1 p-2">
          <button
            onClick={() => onChange(options)}
            className="block w-full text-left text-xs text-blue-500 mb-1"
          >
            すべて選択
          </button>
          <button
            onClick={() => onChange([])}
            className="block w-full text-left text-xs text-blue-500 mb-1"
          >
            すべて解除
          </button>
          {options.map((option) => (
            <div key={option}>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={(e) => {
                    let newSelected: string[];
                    if (e.target.checked) {
                      newSelected = [...selected, option];
                    } else {
                      newSelected = selected.filter((s) => s !== option);
                    }
                    onChange(newSelected);
                  }}
                  className="mr-1"
                />
                <span className="text-xs">{option === '' ? '(空白)' : option}</span>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterSettingsModal: React.FC<FilterSettingsModalProps> = ({
  onClose,
  onSave,
  fileContent,
  mappingData,
  initialFilters = [],
}) => {
  // 初期フィルタには必ず inputValue を設定しておく（初期状態はユーザが必要な項目のみ追加）
  const initFilters = initialFilters.map(f => ({ ...f, inputValue: f.inputValue || '' }));
  const [filters, setFilters] = useState<FilterCondition[]>(initFilters);
  const [nextFilterId, setNextFilterId] = useState<number>(initFilters.length + 1);
  const [showColumnSelector, setShowColumnSelector] = useState<boolean>(false);

  // 対象列のユニークな値を生成（空白が実際に存在する場合のみ空白も含む）
  const columnOptionsMap = useMemo(() => {
    const map: { [columnIndex: number]: string[] } = {};
    if (!fileContent) return map;
    mappingData.columns.forEach((col, index) => {
      const adjusted = col.filePos - 1;
      const opts = new Set<string>();
      fileContent.split('\n').forEach((line) => {
        const cols = line.split('\t');
        if (cols.length > adjusted) {
          opts.add(cols[adjusted]);
        }
      });
      map[index] = Array.from(opts);
    });
    return map;
  }, [fileContent, mappingData.columns]);

  // 元データの文字数と行数
  const originalCharCount = useMemo(() => fileContent.length, [fileContent]);
  const originalLineCount = useMemo(() => fileContent.split('\n').length, [fileContent]);

  // フィルタ条件に基づく絞り込み結果
  const filteredContent = useMemo(() => {
    if (filters.length === 0) return fileContent;
    const lines = fileContent.split('\n');
    const filteredLines = lines.filter((line) => {
      const cols = line.split('\t');
      return filters.every((filter) => {
        const cell = cols[filter.columnIndex] ?? '';
        // テキスト入力がある場合はその文字列で部分一致検索
        if (filter.inputValue.trim() !== '') {
          return cell.indexOf(filter.inputValue.trim()) !== -1;
        } else {
          // チェックボックス選択がある場合は、選択されたいずれかと一致する（論理和）
          if (filter.value.length === 0) return true;
          return filter.value.includes(cell);
        }
      });
    });
    return filteredLines.join('\n');
  }, [fileContent, filters]);

  const filteredCharCount = useMemo(() => filteredContent.length, [filteredContent]);
  const filteredLineCount = useMemo(() => filteredContent.split('\n').length, [filteredContent]);

  // 「フィルタを追加」ボタン（任意の項目のみ追加可能）
  const handleAddFilter = () => {
    setShowColumnSelector(true);
  };

  // ユーザが追加する項目を選択
  const handleColumnSelect = (columnIndex: number) => {
    setFilters([...filters, { id: nextFilterId, columnIndex, value: [], inputValue: '' }]);
    setNextFilterId(nextFilterId + 1);
    setShowColumnSelector(false);
  };

  const handleRemoveFilter = (filterId: number) => {
    setFilters(filters.filter((f) => f.id !== filterId));
  };

  // テキスト入力変化：入力があればチェックボックス選択はクリア
  const handleTextChange = (filterId: number, value: string) => {
    setFilters(
      filters.map((f) =>
        f.id === filterId ? { ...f, inputValue: value, value: [] } : f
      )
    );
  };

  // チェックボックス変更時：選択があればテキスト入力はクリア
  const handleCheckboxChange = (filterId: number, selected: string[]) => {
    setFilters(
      filters.map((f) =>
        f.id === filterId ? { ...f, value: selected, inputValue: '' } : f
      )
    );
  };

  // 保存ボタンは、元のファイルが 500万文字以内かつ5000行以下の場合のみ有効
  const canSave = useMemo(() => {
    return originalCharCount <= 5000000 && originalLineCount <= 5000;
  }, [originalCharCount, originalLineCount]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* モーダルの縦幅拡大（max-h 90vh） */}
      <div className="bg-white p-4 rounded-md shadow-lg w-4/5 max-h-[90vh] overflow-auto">
        <h2 className="text-lg font-semibold mb-4">フィルタ設定</h2>
        {/* ファイル情報の表示 */}
        <div className="mb-4 text-xs text-gray-700">
          <p>元のファイル: {originalCharCount} 文字, {originalLineCount} 行</p>
          <p>絞り込み結果: {filteredCharCount} 文字, {filteredLineCount} 行</p>
        </div>
        <div className="mb-4">
          <button
            onClick={handleAddFilter}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            フィルタを追加
          </button>
        </div>
        {showColumnSelector && (
          <div className="mb-4 border p-2 rounded">
            <p className="text-sm mb-2 font-medium">追加する項目を選択</p>
            <div className="grid grid-cols-2 gap-2">
              {mappingData.columns.map((col, index) => (
                <button
                  key={index}
                  onClick={() => handleColumnSelect(index)}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-left rounded-md"
                >
                  {col.hdNameJ || col.hdName || `列 ${index + 1}`}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="mb-4 space-y-4">
          {filters.length === 0 ? (
            <p className="text-xs text-gray-500">フィルタ条件はありません</p>
          ) : (
            filters.map((filter) => (
              <div key={filter.id} className="flex flex-col border p-2 rounded">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">
                    {mappingData.columns[filter.columnIndex]?.hdNameJ ||
                      mappingData.columns[filter.columnIndex]?.hdName ||
                      `列 ${filter.columnIndex + 1}`}
                    :
                  </span>
                  <button
                    onClick={() => handleRemoveFilter(filter.id)}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    削除
                  </button>
                </div>
                {/* テキスト入力（入力優先） */}
                <input
                  type="text"
                  value={filter.inputValue}
                  onChange={(e) => handleTextChange(filter.id, e.target.value)}
                  placeholder="フィルタ条件を入力（入力優先）"
                  className="mt-1 p-1 border border-gray-300 text-xs text-left"
                />
                {/* チェックボックス（テキストが空の場合に利用） */}
                <div className="mt-1">
                  <FilterDropdown
                    options={columnOptionsMap[filter.columnIndex] || []}
                    selected={filter.value}
                    onChange={(selected) => handleCheckboxChange(filter.id, selected)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            キャンセル
          </button>
          <button
            onClick={() => onSave(filters)}
            disabled={!canSave}
            className={`px-3 py-1 text-sm rounded-md ${
              canSave ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSettingsModal;