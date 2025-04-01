// /app/contents/mappings/components/FileImportModal.tsx

import React, { useState, useEffect } from 'react';
import { MappingData } from '../types';

interface FilterCondition {
  id: number;
  columnIndex: number;
  inputValue: string;
  comparisonOp: 'eq' | 'neq';
}

export interface ImportModalState {
  selectedFile: File | null;
  fileContent: string;
  filters: FilterCondition[];
  fileStats: {
    totalChars: number;
    totalLines: number;
    filteredChars: number;
    filteredLines: number;
  };
}

interface FileImportModalProps {
  onClose: () => void;
  onImport: (data: string, modalState: ImportModalState) => void;
  mappingData: MappingData;
}

const FileImportModal: React.FC<FileImportModalProps> = ({
  onClose,
  onImport,
  mappingData,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [fileStats, setFileStats] = useState<{
    totalChars: number;
    totalLines: number;
    filteredChars: number;
    filteredLines: number;
  }>({
    totalChars: 0,
    totalLines: 0,
    filteredChars: 0,
    filteredLines: 0,
  });
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [nextFilterId, setNextFilterId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [skipFirstRow, setSkipFirstRow] = useState(true);

  const MAX_CHARS = 5000000;
  const MAX_ROWS = 5000;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      const allLines = content.split('\n');
      const effectiveLines = skipFirstRow ? allLines.slice(1) : allLines;
      // 総文字数／総行数はファイル全体の値
      const totalChars = content.length;
      const totalLines = allLines.length;
      // filtered の文字数は、各行の長さの合計＋（行数 - 1） ※行数がゼロでなければ改行分も加算
      const filteredChars = effectiveLines.length > 0 
        ? effectiveLines.reduce((sum, line) => sum + line.length, 0) + (effectiveLines.length - 1)
        : 0;
      const filteredLines = effectiveLines.length;
      setFileStats({
        totalChars,
        totalLines,
        filteredChars,
        filteredLines,
      });
      setLoading(false);
    };
    reader.readAsText(file);
  };

  const handleAddFilter = () => {
    setShowColumnSelector(true);
  };

  const handleRemoveFilter = (filterId: number) => {
    setFilters(filters.filter((filter) => filter.id !== filterId));
  };

  const handleFilterValueChange = (filterId: number, value: string) => {
    setFilters(
      filters.map((filter) =>
        filter.id === filterId ? { ...filter, inputValue: value } : filter
      )
    );
  };

  const handleColumnSelect = (index: number) => {
    if (mappingData.columns[index].filePos === 0) return;
    setFilters([
      ...filters,
      { id: nextFilterId, columnIndex: index, inputValue: '', comparisonOp: 'eq' }
    ]);
    setNextFilterId(nextFilterId + 1);
    setShowColumnSelector(false);
  };

  const handleToggleComparison = (filterId: number) => {
    setFilters(
      filters.map((filter) =>
        filter.id === filterId
          ? { ...filter, comparisonOp: filter.comparisonOp === 'eq' ? 'neq' : 'eq' }
          : filter
      )
    );
  };

  useEffect(() => {
    if (!fileContent) return;
    // ファイル内の改行コードを判定
    const newline = fileContent.indexOf('\r\n') > -1 ? '\r\n' : '\n';
    // ファイル全体をsplit：split後、末尾が空文字の場合は除外（行数にはカウントしない）
    let allLines = fileContent.split(/\r?\n/);
    if (allLines.length && allLines[allLines.length - 1] === '') {
      allLines.pop();
    }
    const totalLines = allLines.length;
    const totalChars = fileContent.length; // 改行もファイル内の実態に合わせてカウント（例：CRLFは2文字）

    // skipFirstRow が true の場合、先頭行を除外した行群を対象にする
    const effectiveLines = skipFirstRow ? allLines.slice(1) : allLines;
    let filteredLines: string[];
    if (filters.length === 0) {
      filteredLines = effectiveLines;
    } else {
      filteredLines = effectiveLines.filter((line) => {
        const columns = line.split('\t');
        return filters.every((filter) => {
          const colMapping = mappingData.columns[filter.columnIndex];
          const filePos = colMapping.filePos;
          if (filePos > columns.length) return false;
          const cellValue = columns[filePos - 1];
          const filterVal = filter.inputValue.trim();
          if (filterVal === '') return true;
          if (filter.comparisonOp === 'eq') {
            return filterVal === '空白' ? cellValue === '' : cellValue === filterVal;
          } else {
            return filterVal === '空白' ? cellValue !== '' : cellValue !== filterVal;
          }
        });
      });
    }
    // フィルタ後の文字列は、各行を元の改行コードで連結して算出
    const fChars = filteredLines.length > 0 ? filteredLines.join(newline).length : 0;
    setFileStats({
      totalChars,
      totalLines,
      filteredChars: fChars,
      filteredLines: filteredLines.length,
    });
  }, [fileContent, filters, mappingData.columns, skipFirstRow]);

  const handleImport = () => {
    if (!fileContent) return;
    const newline = fileContent.indexOf('\r\n') > -1 ? '\r\n' : '\n';
    let linesArr = fileContent.split(/\r?\n/);
    // 同様に末尾が空文字なら除外（行数としてはカウントしない）
    if (linesArr.length && linesArr[linesArr.length - 1] === '') {
      linesArr.pop();
    }
    if (skipFirstRow) {
      linesArr = linesArr.slice(1);
    }
    const filteredLines = linesArr.filter((line) => {
      if (filters.length === 0) return true;
      const columns = line.split('\t');
      return filters.every((filter) => {
        const colMapping = mappingData.columns[filter.columnIndex];
        const filePos = colMapping.filePos;
        if (filePos > columns.length) return false;
        const cellValue = columns[filePos - 1];
        const filterVal = filter.inputValue.trim();
        if (filterVal === '') return true;
        if (filter.comparisonOp === 'eq') {
          return filterVal === '空白' ? cellValue === '' : cellValue === filterVal;
        } else {
          return filterVal === '空白' ? cellValue !== '' : cellValue !== filterVal;
        }
      });
    });
    onImport(filteredLines.join(newline), {
      selectedFile,
      fileContent,
      filters,
      fileStats,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-md shadow-lg w-4/5 max-h-[80vh] overflow-auto">
        <h2 className="text-lg font-semibold mb-4">ファイルからデータを取り込む</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">ファイルを選択</label>
          <input type="file" onChange={handleFileSelect} className="block w-full text-sm" />
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              checked={skipFirstRow}
              onChange={(e) => setSkipFirstRow(e.target.checked)}
              className="form-checkbox"
            />
            <span className="ml-2">先頭行を除外する</span>
          </label>
        </div>
        {loading && (
          <div className="text-center py-4">
            <p>読み込み中...</p>
          </div>
        )}
        {selectedFile && !loading && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="border p-2 rounded-md">
                <h3 className="font-medium text-sm mb-1">ファイル情報</h3>
                <p className="text-xs">名前: {selectedFile.name}</p>
                <p className="text-xs">サイズ: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                <p className="text-xs">総文字数: {fileStats.totalChars.toLocaleString()}</p>
                <p className="text-xs">総行数: {fileStats.totalLines.toLocaleString()}</p>
              </div>
              <div className="border p-2 rounded-md">
                <h3 className="font-medium text-sm mb-1">フィルタ後</h3>
                <p className="text-xs">フィルタ後文字数: {fileStats.filteredChars.toLocaleString()}</p>
                <p className="text-xs">フィルタ後行数: {fileStats.filteredLines.toLocaleString()}</p>
              </div>
            </div>

            {showColumnSelector && (
              <div className="mb-4 border p-2 rounded-md">
                <p className="text-sm font-medium mb-2">追加する項目を選択</p>
                <div className="grid grid-cols-2 gap-2">
                  {mappingData.columns.map((col, index) => {
                    if (col.filePos === 0) return null;
                    const alreadySelected = filters.some(filter => filter.columnIndex === index);
                    return (
                      <button
                        key={index}
                        onClick={() => !alreadySelected && handleColumnSelect(index)}
                        disabled={alreadySelected}
                        className={`px-2 py-1 text-xs text-left rounded-md ${
                          alreadySelected
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {col.hdNameJ || col.hdName || `列 ${index + 1}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-sm">フィルタ条件</h3>
                <button
                  onClick={handleAddFilter}
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  フィルタを追加
                </button>
              </div>
              {filters.length === 0 ? (
                <p className="text-xs text-gray-500">フィルタ条件はありません</p>
              ) : (
                <div className="space-y-1">
                  {filters.map((filter) => (
                    <div
                      key={filter.id}
                      className="grid grid-cols-3 gap-x-1 gap-y-1 items-center"
                    >
                      {/* 項目ラベル */}
                      <span className="text-xs font-medium text-left whitespace-nowrap">
                        {mappingData.columns[filter.columnIndex]?.hdNameJ ||
                          mappingData.columns[filter.columnIndex]?.hdName ||
                          `列 ${filter.columnIndex + 1}`}
                      </span>
                      {/* トグルボタンと入力フィールドをまとめたコンテナ */}
                      <div className="flex items-center gap-x-0.5">
                        <button
                          onClick={() => handleToggleComparison(filter.id)}
                          className="px-1 py-1 text-xs border rounded-md w-fit"
                        >
                          {filter.comparisonOp === 'eq' ? '=' : '≠'}
                        </button>
                        <input
                          list={`option-${filter.id}`}
                          value={filter.inputValue}
                          onChange={(e) => handleFilterValueChange(filter.id, e.target.value)}
                          placeholder="フィルタ条件を入力"
                          className="px-1 py-1 text-xs border rounded-md text-left"
                        />
                        <datalist id={`option-${filter.id}`}>
                          <option value="空白" />
                        </datalist>
                      </div>
                      {/* 削除ボタン */}
                      <button
                        onClick={() => handleRemoveFilter(filter.id)}
                        className="px-1 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 w-fit"
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            キャンセル
          </button>
          <button
            onClick={handleImport}
            disabled={
              !selectedFile ||
              loading ||
              fileStats.filteredChars > MAX_CHARS ||
              fileStats.filteredLines > 5000
            }
            className={`px-3 py-1 text-sm rounded-md ${!selectedFile ||
                loading ||
                fileStats.filteredChars > MAX_CHARS ||
                fileStats.filteredLines > 5000
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
          >
            取り込む
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileImportModal;