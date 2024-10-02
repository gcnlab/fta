// /app/contents/wizards/migration/components/useDownloadExcel.tsx
import { useState } from 'react';

export const useDownloadExcel = () => {
  const [loading, setLoading] = useState(false);

  const handleDownloadExcel = async () => {
    setLoading(true);

    try {
      const storageKey = 'selectedToolMigrationWizard';
      const jsonDataString = localStorage.getItem(storageKey);

      if (!jsonDataString) {
        throw new Error('ローカルストレージにデータが見つかりません。');
      }

      const jsonData = JSON.parse(jsonDataString);

      const response = await fetch('http://127.0.0.1:5000/json-to-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'releaseManual.xlsx');
        document.body.appendChild(link);
        link.click();
        // TypeScript の警告を防ぐためにオプショナルチェイニングを使用
        link.parentNode?.removeChild(link);
      } else {
        console.error('ファイルのダウンロードに失敗しました。');
        alert('ファイルのダウンロードに失敗しました。');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('エラーが発生しました:', error.message);
        alert(`エラーが発生しました: ${error.message}`);
      } else {
        console.error('エラーが発生しました:', error);
        alert('エラーが発生しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    handleDownloadExcel,
    loading,
  };
};
