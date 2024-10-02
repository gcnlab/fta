// /app/contents/wizards/migration/components/DataImport.tsx

import React, { ChangeEvent } from 'react';

interface DataImportProps {
  onDataImport: (importedData: any) => void;
  className?: string;
}

const DataImport: React.FC<DataImportProps> = ({ onDataImport, className }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target?.result as string);
          onDataImport(importedData);
        } catch (error) {
          alert('無効なファイル形式です。正しいJSONファイルを選択してください。');
        }
      };
      reader.onerror = () => {
        alert('ファイルの読み込み中にエラーが発生しました。');
      };
      reader.readAsText(file);
    }
  };

  return (
    <label
      className={`cursor-pointer inline-block ${className}`}
      htmlFor="data-import-input"
    >
      <input
        type="file"
        id="data-import-input"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      アップロード
    </label>
  );
};

export default DataImport;
