// /app/contents/mappings/UserMappingInput.tsx

import React, { useState, useRef, useEffect } from 'react';
import { MappingData } from './types';
import MappingModal from './MappingModal';

interface UserMappingInputProps {
    onApply: (userMapping: MappingData) => void;
}

const UserMappingInput: React.FC<UserMappingInputProps> = ({ onApply }) => {
    const [inputText, setInputText] = useState<string>('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [mappingData, setMappingData] = useState<MappingData | null>(null);

    // コンポーネントのマウント時に localStorage からデータを読み込む
    useEffect(() => {
        const savedInputText = localStorage.getItem('userMappingInputText');
        if (savedInputText) {
            setInputText(savedInputText);
        }
    }, []);

    // inputText が変更されたときに localStorage に保存する
    useEffect(() => {
        localStorage.setItem('userMappingInputText', inputText);
    }, [inputText]);

    const handleApply = () => {
        const lines = inputText.split('\n').filter((line) => line.trim() !== '');
        const columns = lines.map((line, index) => {
            const parts = line.split('\t');
            const colPos = index + 1; // 連番

            const hdNameJ = parts[0] && parts[0].trim() !== '' ? parts[0] : `項目${colPos}`;
            const hdName = parts[1] && parts[1].trim() !== '' ? parts[1] : `column${colPos}`;
            const filePos = parts[3] && !isNaN(parseInt(parts[3], 10)) ? parseInt(parts[3], 10) : 0;

            return {
                hdNameJ,
                hdName,
                colPos,
                filePos,
            };
        });

        const userMapping: MappingData = {
            fileName: 'user-mapping',
            tableName: 'user-table',
            tableNameJ: 'ユーザテーブル',
            columns: columns,
        };

        onApply(userMapping);
        // 入力内容をクリアする場合は以下のコメントを外してください
        // setInputText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const textarea = textareaRef.current;
            if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;

                // 現在のテキストを取得
                const text = inputText;

                // タブ文字を挿入
                const before = text.substring(0, start);
                const after = text.substring(end);
                const newText = before + '\t' + after;
                setInputText(newText);

                // カーソル位置をタブ文字の後に移動
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start + 1;
                }, 0);
            }
        }
    };

    const openModal = () => {
        const initialColumns = inputText
            ? inputText
                  .split('\n')
                  .filter((line) => line.trim() !== '')
                  .map((line, index) => {
                      const parts = line.split('\t');
                      return {
                          hdNameJ: parts[0] ? parts[0] : '',
                          hdName: parts[1] ? parts[1] : '',
                          colPos: index + 1, // 連番
                          filePos: parts[3] ? parseInt(parts[3], 10) : 0,
                      };
                  })
            : [
                  {
                      hdNameJ: '',
                      hdName: '',
                      colPos: 1,
                      filePos: 0,
                  },
              ];

        const mapping: MappingData = {
            fileName: 'user-mapping',
            tableName: 'user-table',
            tableNameJ: 'ユーザテーブル',
            columns: initialColumns,
        };

        setMappingData(mapping);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleApplyTemporaryMapping = (mapping: MappingData) => {
        // テキストエリアにマッピングデータを反映
        const newText = mapping.columns
            .map(
                (col) =>
                    `${col.hdNameJ}\t${col.hdName}\t${col.colPos}\t${col.filePos}`
            )
            .join('\n');
        setInputText(newText);
        setIsModalOpen(false);
    };

    return (
        <div className="p-4 bg-white rounded-md shadow-md">
            <h3 className="text-sm font-semibold mb-2">ユーザマッピング定義</h3>
            <textarea
                ref={textareaRef}
                className="w-full h-32 p-2 border border-gray-300 rounded-md text-xs"
                style={{ whiteSpace: 'nowrap', fontFamily: 'monospace' }} // 横スクロールを適用
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown} // タブキーのハンドリングを追加
                placeholder={`マッピング定義（タブ区切り）を貼り付けてください。\n書式: 日本語項目名\t英語項目名\t列位置\tファイル位置`}
            ></textarea>
            <div className="flex justify-end mt-2 space-x-2">
                <button
                    onClick={openModal}
                    className="px-3 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 active:bg-gray-800 transition-all"
                >
                    入力ガイド
                </button>
                <button
                    onClick={handleApply}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 active:bg-blue-700 transition-all"
                >
                    マッピング画面へ
                </button>
            </div>
            {isModalOpen && mappingData && (
                <MappingModal
                    onClose={closeModal}
                    onApplyTemporaryMapping={handleApplyTemporaryMapping}
                    mappingData={mappingData}
                />
            )}
        </div>
    );
};

export default UserMappingInput;
