// /app/contents/mappings/MappingModal.tsx

import React, { useState, useEffect } from 'react';
import { MappingData } from './types';
import Tooltip from '../../components/Tooltip';

interface MappingModalProps {
    onClose: () => void;
    onApplyTemporaryMapping: (mapping: MappingData) => void;
    mappingData: MappingData;
}

const MappingModal: React.FC<MappingModalProps> = ({
    onClose,
    onApplyTemporaryMapping,
    mappingData,
}) => {
    const [editableData, setEditableData] = useState(
        mappingData.columns || []
    );
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [activeRowIndex, setActiveRowIndex] = useState<number>(0);

    // エスケープキーでモーダルを閉じる
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    // colPos を再計算して更新する関数
    const updateColPos = (data: typeof editableData) => {
        return data.map((item, index) => ({
            ...item,
            colPos: index + 1,
        }));
    };

    // セル変更時のデータ更新
    const handleCellChange = (
        rowIndex: number,
        field: 'hdNameJ' | 'hdName' | 'filePos',
        value: string
    ) => {
        const updatedData = [...editableData];
        if (field === 'filePos') {
            const sanitizedValue = value.replace(/[^\d]/g, '');
            updatedData[rowIndex][field] =
                sanitizedValue === '' ? 0 : parseInt(sanitizedValue, 10);
        } else {
            updatedData[rowIndex][field] = value;
        }
        setEditableData(updatedData);
    };

    // 行の削除
    const handleRemoveRow = (rowIndex: number) => {
        if (editableData.length === 1) return; // 行数が1の場合は削除しない
        let updatedData = editableData.filter((_, index) => index !== rowIndex);
        updatedData = updateColPos(updatedData);
        setEditableData(updatedData);

        // activeRowIndexを調整
        if (activeRowIndex >= updatedData.length) {
            setActiveRowIndex(updatedData.length - 1);
        }
    };

    // 行の追加
    const handleAddRow = (rowIndex: number) => {
        const newRow = {
            hdNameJ: '',
            hdName: '',
            colPos: 0,
            filePos: 0,
        };
        let updatedData = [...editableData];
        updatedData.splice(rowIndex + 1, 0, newRow);
        updatedData = updateColPos(updatedData);
        setEditableData(updatedData);

        // 新しい行をアクティブに設定
        setActiveRowIndex(rowIndex + 1);
    };

    // 行の入れ替え（上）
    const handleMoveUp = () => {
        if (activeRowIndex === 0) return;
        let updatedData = [...editableData];
        [updatedData[activeRowIndex - 1], updatedData[activeRowIndex]] = [
            updatedData[activeRowIndex],
            updatedData[activeRowIndex - 1],
        ];
        updatedData = updateColPos(updatedData);
        setEditableData(updatedData);
        setActiveRowIndex(activeRowIndex - 1);
    };

    // 行の入れ替え（下）
    const handleMoveDown = () => {
        if (activeRowIndex === editableData.length - 1) return;
        let updatedData = [...editableData];
        [updatedData[activeRowIndex], updatedData[activeRowIndex + 1]] = [
            updatedData[activeRowIndex + 1],
            updatedData[activeRowIndex],
        ];
        updatedData = updateColPos(updatedData);
        setEditableData(updatedData);
        setActiveRowIndex(activeRowIndex + 1);
    };

    // プレースホルダーの設定と適用時の処理
    const handleApply = () => {
        const updatedData = editableData.map((col) => {
            const hdNameJ = col.hdNameJ || `項目${col.colPos}`;
            const hdName = col.hdName || `column${col.colPos}`;
            return { ...col, hdNameJ, hdName };
        });
        onApplyTemporaryMapping({ ...mappingData, columns: updatedData });
    };

    const handleCopyToClipboard = async (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        const textToCopy = editableData
            .map(
                (col) =>
                    `${col.hdNameJ || `項目${col.colPos}`}\t${col.hdName || `column${col.colPos}`
                    }\t${col.colPos}\t${col.filePos}`
            )
            .join('\n');

        try {
            await navigator.clipboard.writeText(textToCopy);
            showTooltip(e);
        } catch (error) {
            alert('クリップボードへのコピーに失敗しました。');
        }
    };

    const showTooltip = (event: React.MouseEvent<HTMLButtonElement>) => {
        const tooltipX = event.clientX + 10;
        const tooltipY = event.clientY - 50;
        setTooltipPosition({ x: tooltipX, y: tooltipY });
        setTooltipVisible(true);
        setTimeout(() => setTooltipVisible(false), 1000);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg p-4 w-auto">
                <h2 className="text-sm font-semibold mb-4">
                    {mappingData.fileName}
                </h2>

                {/* テーブルの高さを制限してスクロールを設定 */}
                <div
                    className="overflow-y-auto"
                    style={{ maxHeight: 'calc(10 * 2.5rem)' }}
                >
                    <table className="w-full text-xs">
                        <thead
                            style={{
                                position: 'sticky',
                                top: 0,
                                backgroundColor: '#fff',
                                zIndex: 1,
                            }}
                        >
                            <tr className="bg-blue-100">
                                <th
                                    className="px-2 py-1 border text-left"
                                    style={{ minWidth: '150px' }}
                                >
                                    日本語項目名
                                </th>
                                <th
                                    className="px-2 py-1 border text-left"
                                    style={{ minWidth: '150px' }}
                                >
                                    英語項目名
                                </th>
                                <th
                                    className="px-2 py-1 border text-left"
                                    style={{
                                        width: '60px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    列位置
                                </th>
                                <th
                                    className="px-2 py-1 border text-left"
                                    style={{
                                        width: '60px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    ファイル位置
                                </th>
                                <th
                                    className="px-2 py-1 border text-center"
                                    style={{ width: '60px' }}
                                >
                                    操作
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {editableData.map((col, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className={
                                        activeRowIndex === rowIndex
                                            ? 'bg-yellow-100'
                                            : ''
                                    }
                                    onClick={() => setActiveRowIndex(rowIndex)}
                                >
                                    <td className="px-2 py-1 border">
                                        <input
                                            type="text"
                                            className="w-full border-none focus:ring-0"
                                            value={col.hdNameJ}
                                            onChange={(e) =>
                                                handleCellChange(
                                                    rowIndex,
                                                    'hdNameJ',
                                                    e.target.value
                                                )
                                            }
                                            placeholder={`項目${col.colPos}`}
                                            style={{
                                                minWidth: '150px',
                                                maxWidth: '300px',
                                            }}
                                        />
                                    </td>
                                    <td className="px-2 py-1 border">
                                        <input
                                            type="text"
                                            className="w-full border-none focus:ring-0"
                                            value={col.hdName}
                                            onChange={(e) =>
                                                handleCellChange(
                                                    rowIndex,
                                                    'hdName',
                                                    e.target.value
                                                )
                                            }
                                            placeholder={`column${col.colPos}`}
                                            style={{
                                                minWidth: '150px',
                                                maxWidth: '300px',
                                            }}
                                        />
                                    </td>
                                    <td className="px-2 py-1 border text-right">
                                        {col.colPos}
                                    </td>
                                    <td className="px-2 py-1 border text-right">
                                        <input
                                            type="text"
                                            className="w-full text-right border-none focus:ring-0"
                                            value={col.filePos}
                                            onChange={(e) =>
                                                handleCellChange(
                                                    rowIndex,
                                                    'filePos',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </td>
                                    <td className="px-2 py-1 border text-center">
                                        <button
                                            onClick={() =>
                                                handleAddRow(rowIndex)
                                            }
                                            className="text-green-500 mr-1"
                                        >
                                            ＋
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleRemoveRow(rowIndex)
                                            }
                                            className={`text-red-500 ${editableData.length === 1
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : ''
                                                }`}
                                            disabled={editableData.length === 1}
                                        >
                                            －
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between mt-4">
                    <div className="flex space-x-2">
                        <button
                            onClick={handleMoveUp}
                            className="px-2 py-1 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 active:bg-gray-700 transition-all"
                            disabled={activeRowIndex === 0}
                        >
                            △
                        </button>
                        <button
                            onClick={handleMoveDown}
                            className="px-2 py-1 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 active:bg-gray-700 transition-all"
                            disabled={
                                activeRowIndex === editableData.length - 1
                            }
                        >
                            ▽
                        </button>
                        <button
                            onClick={handleCopyToClipboard}
                            className="px-2 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 active:bg-gray-800 transition-all"
                        >
                            コピー
                        </button>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleApply}
                            className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 active:bg-blue-700 transition-all"
                        >
                            適用して閉じる
                        </button>
                        <button
                            onClick={onClose}
                            className="px-2 py-1 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 active:bg-gray-700 transition-all"
                        >
                            戻る
                        </button>
                    </div>
                </div>
            </div>
            {tooltipVisible && (
                <Tooltip
                    message="コピーしました"
                    position={tooltipPosition}
                    visible={tooltipVisible}
                    duration={600}
                    onClose={() => setTooltipVisible(false)}
                />
            )}

        </div>
    );
};

export default MappingModal;

