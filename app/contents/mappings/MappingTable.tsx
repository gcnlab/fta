// /app/contents/mappings/MappingTable.tsx

import React, { useState, useEffect } from 'react';
import { MappingData } from './types'; // MappingData の型定義をインポート

interface MappingModalProps {
    onClose: () => void;
    onApplyTemporaryMapping: (mapping: MappingData) => void; // 一時的マッピングの適用関数
    mappingData: MappingData;
}

const MappingModal: React.FC<MappingModalProps> = ({ onClose, onApplyTemporaryMapping, mappingData }) => {
    const [editableData, setEditableData] = useState(mappingData.columns);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // エスケープキーを押したときにモーダルを閉じる
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose(); // エスケープキーが押されたらモーダルを閉じる
            }
        };

        document.addEventListener('keydown', handleEscape);

        // コンポーネントがアンマウントされたときにリスナーを削除
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    // セル変更時のデータ更新
    const handleCellChange = (rowIndex: number, field: 'colPos' | 'filePos', value: string) => {
        const sanitizedValue = value.replace(/[^\d]/g, ''); // 数字以外を除去
        const updatedData = [...editableData];
        updatedData[rowIndex][field] = sanitizedValue === '' ? 0 : parseInt(sanitizedValue, 10); // 数値として扱う
        setEditableData(updatedData);
    };

    const handleBlur = (rowIndex: number, field: 'colPos' | 'filePos') => {
        const updatedData = [...editableData];
        if (isNaN(updatedData[rowIndex][field])) {
            updatedData[rowIndex][field] = 0; // フォーカスが外れた際に数値でないなら 0 にする
        }
        setEditableData(updatedData);
    };

    const handleApplyTemporaryMapping = () => {
        onApplyTemporaryMapping({ ...mappingData, columns: editableData });
    };

    const handleCopyToClipboard = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const textToCopy = editableData.map((col) =>
            `${col.hdNameJ}\t${col.hdName}\t${col.colPos}\t${col.filePos}`
        ).join("\n");

        try {
            await navigator.clipboard.writeText(textToCopy);
            showTooltip(e);
        } catch (error) {
            alert("クリップボードへのコピーに失敗しました。");
        }
    };

    const showTooltip = (event: React.MouseEvent<HTMLButtonElement>) => {
        const tooltipX = event.clientX + 10;
        const tooltipY = event.clientY - 50;
        setTooltipPosition({ x: tooltipX, y: tooltipY });
        setTooltipVisible(true);
        setTimeout(() => setTooltipVisible(false), 1000);
    };

    // 矢印キーでのセル移動
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, cellIndex: number) => {
        let nextElement: HTMLElement | null = null;

        if (e.key === "ArrowUp" && rowIndex > 0) {
            nextElement = document.getElementById(`cell-${rowIndex - 1}-${cellIndex}`);
        } else if (e.key === "ArrowDown" && rowIndex < editableData.length - 1) {
            nextElement = document.getElementById(`cell-${rowIndex + 1}-${cellIndex}`);
        } else if (e.key === "ArrowLeft" && cellIndex > 0) {
            nextElement = document.getElementById(`cell-${rowIndex}-${cellIndex - 1}`);
        } else if (e.key === "ArrowRight" && cellIndex < 3) {
            nextElement = document.getElementById(`cell-${rowIndex}-${cellIndex + 1}`);
        }

        if (nextElement) {
            setTimeout(() => {
                nextElement.focus();
                (nextElement as HTMLInputElement).select(); // テキストを選択状態にする
            }, 0);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg p-4 w-auto">
                <h2 className="text-sm font-semibold mb-4">{mappingData.fileName}</h2>

                {/* テーブルの高さを制限してスクロールを設定 */}
                <div className="overflow-y-auto" style={{ maxHeight: 'calc(15 * 1.5rem)' }}>
                    <table className="w-full text-xs">
                        <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                            <tr className="bg-blue-100">
                                <th className="px-2 py-1 border text-left">日本語項目名</th>
                                <th className="px-2 py-1 border text-left">英語項目名</th>
                                <th className="px-2 py-1 border text-left">列位置</th>
                                <th className="px-2 py-1 border text-left">ファイル位置</th>
                            </tr>
                        </thead>
                        <tbody>
                            {editableData.map((col, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td className="px-2 py-1 border">{col.hdNameJ}</td>
                                    <td className="px-2 py-1 border">{col.hdName}</td>
                                    <td className="px-2 py-1 border text-right" style={{ maxWidth: '50px' }}>{col.colPos}</td>
                                    <td className="px-2 py-1 border text-right" style={{ maxWidth: '50px' }}>
                                        <input
                                            type="text"
                                            className="w-full text-right border-none focus:ring-0"
                                            value={col.filePos}
                                            onChange={(e) => handleCellChange(rowIndex, 'filePos', e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, rowIndex, 1)}
                                            onFocus={(e) => e.target.select()}
                                            id={`cell-${rowIndex}-1`}
                                            tabIndex={0}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        onClick={handleCopyToClipboard}
                        className="px-2 py-1 text-xs bg-gray-600 text-white rounded-md shadow-md hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-700 active:bg-gray-800 transition-all"
                    >
                        クリップボードにコピー
                    </button>
                    <button
                        onClick={handleApplyTemporaryMapping}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md shadow-md hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-blue-600 active:bg-blue-700 transition-all"
                    >
                        一時的にこのマッピングを適用
                    </button>
                    <button
                        onClick={onClose}
                        className="px-2 py-1 text-xs bg-gray-600 text-white rounded-md shadow-md hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-700 active:bg-gray-800 transition-all"
                    >
                        閉じる
                    </button>
                </div>
            </div>
        </div>

    );
};

export default MappingModal;

