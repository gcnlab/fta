// /app/contents/wizards/migration/components/DataExport.tsx

import React from 'react';

interface DataExportProps {
  data: any;
  className?: string;
  fileName?: string;
}

const DataExport: React.FC<DataExportProps> = ({ data, className, fileName = 'migrationWizardData.json' }) => {
  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('データのエクスポート中にエラーが発生しました。');
    }
  };

  return (
    <button
      className={className}
      onClick={handleExport}
      aria-label="ダウンロード"
    >
      ダウンロード
    </button>
  );
};

export default DataExport;
