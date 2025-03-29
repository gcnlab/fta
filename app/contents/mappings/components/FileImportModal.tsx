// /app/contents/mappings/components/FileImportModal.tsx

import React, { useState, useEffect } from 'react';
import { MappingData } from '../types';

interface FilterCondition {
  id: number;
  columnIndex: number;
  value: string;
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
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [loading, setLoading] = useState(false);

  const MAX_CHARS = 1000000;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      const lines = content.split('\n');
      setFileStats({
        totalChars: content.length,
        totalLines: lines.length,
        filteredChars: content.length,
        filteredLines: lines.length,
      });
      setLoading(false);
    };
    reader.readAsText(file);
  };

  const handleAddFilter = () => {
    setShowColumnSelector(true);
  };

  const handleColumnSelect = (columnIndex: number) => {
    setFilters([...filters, { id: nextFilterId, columnIndex, value: '' }]);
    setNextFilterId(nextFilterId + 1);
    setShowColumnSelector(false);
  };

  const handleRemoveFilter = (filterId: number) => {
    setFilters(filters.filter(filter => filter.id !== filterId));
  };

  const handleFilterValueChange = (filterId: number, value: string) => {
    setFilters(filters.map(filter =>
      filter.id === filterId ? { ...filter, value } : filter
    ));
  };

  useEffect(() => {
    if (!fileContent) return;
    if (filters.length === 0) {
      const noFilterLines = fileContent.split('\n');
      setFileStats(prev => ({
        ...prev,
        filteredChars: fileContent.length,
        filteredLines: noFilterLines.length,
      }));
      return;
    }
    const linesArr = fileContent.split('\n');
    const filteredLines = linesArr.filter(line => {
      const columns = line.split('\t');
      return filters.every(filter => {
        const colMapping = mappingData.columns[filter.columnIndex];
        const filePos = colMapping.filePos;
        if (filePos > columns.length) return false;
        // 補正: filePosは1オリジンなので、実際はfilePos - 1の位置をチェック
        return columns[filePos - 1].includes(filter.value);
      });
    });
    const filteredContent = filteredLines.join('\n');
    setFileStats(prev => ({
      ...prev,
      filteredChars: filteredContent.length,
      filteredLines: filteredLines.length,
    }));
  }, [fileContent, filters, mappingData.columns]);

  const handleImport = () => {
    if (!fileContent) return;
    const linesArr = fileContent.split('\n');
    const filteredLines = linesArr.filter(line => {
      if (filters.length === 0) return true;
      const columns = line.split('\t');
      return filters.every(filter => {
        const colMapping = mappingData.columns[filter.columnIndex];
        const filePos = colMapping.filePos;
        if (filePos > columns.length) return false;
        // 補正: filePos は1オリジンなので filePos - 1 を使用
        return columns[filePos - 1].includes(filter.value);
      });
    });
    onImport(filteredLines.join('\n'), {
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ファイルを選択
          </label>
          <input type="file" onChange={handleFileSelect} className="block w-full text-sm" />
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
                <div className="space-y-2">
                  {filters.map(filter => (
                    <div key={filter.id} className="flex items-center space-x-2">
                      <span className="text-xs font-medium">
                        {mappingData.columns[filter.columnIndex]?.hdNameJ ||
                          mappingData.columns[filter.columnIndex]?.hdName ||
                          `列 ${filter.columnIndex + 1}`}:
                      </span>
                      <input
                        type="text"
                        value={filter.value}
                        onChange={(e) => handleFilterValueChange(filter.id, e.target.value)}
                        className="flex-1 border px-2 py-1 text-xs rounded-md"
                        placeholder="フィルタ値を入力"
                      />
                      <button
                        onClick={() => handleRemoveFilter(filter.id)}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {showColumnSelector && (
              <div className="border p-2 rounded-md mb-4">
                <h3 className="font-medium text-sm mb-1">項目を選択</h3>
                <div className="max-h-32 overflow-y-auto grid grid-cols-2 gap-1">
                  {mappingData.columns.map((column, index) => (
                    <button
                      key={index}
                      onClick={() => handleColumnSelect(index)}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-left rounded-md"
                    >
                      {column.hdNameJ || column.hdName || `列 ${index + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
            disabled={!selectedFile || loading || fileStats.filteredChars > MAX_CHARS}
            className={`px-3 py-1 text-sm rounded-md ${
              !selectedFile || loading || fileStats.filteredChars > MAX_CHARS
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