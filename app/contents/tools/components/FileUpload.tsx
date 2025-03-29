// /app/contents/tools/components/FileUpload.tsx

import React, { useState } from 'react';

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [lineCount, setLineCount] = useState<number | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // ファイル選択時の処理
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
      setErrorMessage(null);
      setUploadedUrl(null);
      // （任意）テキストファイルの場合、行数をカウント
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const fileContent = fileReader.result as string;
        const lines = fileContent.split('\n');
        setLineCount(lines.length);
      };
      fileReader.readAsText(file);
    } else {
      setErrorMessage('ファイルが選択されていません');
    }
  };

  // ファイルアップロード処理
  const handleFileUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('ファイルが選択されていません');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await fetch('/api/uploadFile', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('ファイルアップロードに失敗しました');
      }
      const data = await response.json();
      console.log('アップロードされたファイル:', data.file);
      setUploadedUrl(data.file.url);
      setErrorMessage(null);
    } catch (error: unknown) {
      console.error('アップロードエラー:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('不明なエラーが発生しました');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <form>
        <input type="file" onChange={handleFileSelect} />
      </form>
      {selectedFile && (
        <div>
          <p>選択したファイル: {selectedFile.name}</p>
          {lineCount !== null && <p>行数 (アップロード前): {lineCount}</p>}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <button
            type="button"
            onClick={handleFileUpload}
            disabled={uploading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {uploading ? 'アップロード中...' : 'ファイルをアップロード'}
          </button>
          {uploadedUrl && (
            <p>
              アップロード成功！ファイルURL: <a href={uploadedUrl}>{uploadedUrl}</a>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
