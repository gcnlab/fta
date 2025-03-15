// /app/contents/mappings/components/MappingDisplayTable.tsx

"use client";

import React from 'react';
import { MappingData } from '../types';

interface MappingDisplayTableProps {
    formattedData: string[][];
    mappingData: MappingData;
    isJapanese: boolean;
    toggleHeader: () => void;
    includeHeader: boolean;
    reverseParse: boolean;
    handleCopyToClipboard: (e: React.MouseEvent<HTMLButtonElement>) => void;
    handleDownload: () => void;
    handleIncludeHeaderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleReverseParseChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCellChange: (rowIndex: number, cellIndex: number, value: string) => void;
    handleCellDoubleClick: (rowIndex: number, cellIndex: number) => void;
    editingCell: { row: number, col: number } | null;
    setEditingCell: (cell: { row: number, col: number } | null) => void;
    isTemporaryMapping: boolean; // 追加
}

const MappingDisplayTable: React.FC<MappingDisplayTableProps> = ({
    formattedData,
    mappingData,
    isJapanese,
    toggleHeader,
    includeHeader,
    reverseParse,
    handleCopyToClipboard,
    handleDownload,
    handleIncludeHeaderChange,
    handleReverseParseChange,
    handleCellChange,
    handleCellDoubleClick,
    editingCell,
    setEditingCell,
    isTemporaryMapping,
}) => {
    return (
        <>
            {/* tableName と tableNameJ の表示 */}
            <h2 className="mt-5 text-sm font-semibold mb-1">
                {isJapanese ? mappingData.tableNameJ : mappingData.tableName}
            </h2>

            {/* ヘッダ切り替えボタン */}
            <button
                onClick={toggleHeader}
                className="mb-2 px-2 py-1 text-xs bg-gray-300 rounded-md shadow-md hover:bg-gray-400 active:bg-gray-500 transition-all"
            >
                {isJapanese ? "英語名に切り替え" : "日本語名に切り替え"}
            </button>

            <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '270px' }}>
                <table className="w-full border-collapse text-xs">
                    <thead style={{ position: 'sticky', top: 0 }}>
                        <tr className='bg-slate-50'>
                            <th
                                className="p-1 text-right"
                                style={{ width: '20px', border: 'none', fontSize: '10px', padding: '0px' }}
                            ></th>
                            {mappingData.columns.map((col) => (
                                <th
                                    key={col.colPos}
                                    className={`p-1 text-left ${isTemporaryMapping ? 'text-blue-500' : 'text-black'}`}
                                    style={{
                                        border: 'none',
                                        fontSize: '10px',
                                        padding: '0px 0px 0px 7px'
                                    }}
                                >
                                    {col.filePos}
                                </th>
                            ))}
                        </tr>
                        <tr className="bg-gray-100" style={{ height: '20px' }}>
                            <th
                                className="p-1 text-right"
                                style={{ width: '20px', border: 'none' }}
                            >
                                No.
                            </th>
                            {mappingData.columns.map((col) => (
                                <th
                                    key={col.colPos}
                                    className="p-1 border text-left"
                                    style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '100px',
                                        fontSize: '12px',
                                        height: '20px',
                                        color: col.filePos === 0 ? 'gray' : 'black',
                                    }}
                                    title={isJapanese ? col.hdNameJ : col.hdName}
                                >
                                    {isJapanese ? col.hdNameJ : col.hdName}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {formattedData.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                style={{
                                    height: '18px',
                                    backgroundColor: rowIndex % 2 === 0 ? '#fffff0' : 'white'
                                }}
                            >
                                <td
                                    className="p-0.5 text-right"
                                    style={{ width: '20px', border: 'none' }}
                                >
                                    {rowIndex + 1}
                                </td>
                                {row.map((cell, cellIndex) => (
                                    <td
                                        key={cellIndex}
                                        className="p-0.5 border"
                                        contentEditable={editingCell?.row === rowIndex && editingCell?.col === cellIndex}
                                        suppressContentEditableWarning={true}
                                        onDoubleClick={() => handleCellDoubleClick(rowIndex, cellIndex)}
                                        onBlur={(e) => handleCellChange(rowIndex, cellIndex, e.currentTarget.innerText)}
                                        style={{ whiteSpace: 'nowrap', fontSize: '12px', height: '18px' }}
                                        onClick={() => setEditingCell({ row: rowIndex, col: cellIndex })} // 修正
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex space-x-2 mt-2 items-center justify-start">
                <button
                    onClick={handleCopyToClipboard}
                    className="px-2 py-1 text-xs bg-gray-600 text-white rounded-md shadow-md hover:bg-gray-700 active:bg-gray-800 transition-all"
                >
                    コピー
                </button>
                <button
                    onClick={handleDownload}
                    className="px-2 py-1 text-xs bg-gray-600 text-white rounded-md shadow-md hover:bg-gray-700 active:bg-gray-800 transition-all"
                >
                    ダウンロード
                </button>

                {/* ヘッダを含めるチェックボックス */}
                <label className="ml-4 text-xs flex items-center">
                    <input
                        type="checkbox"
                        checked={includeHeader}
                        onChange={handleIncludeHeaderChange}
                        className="mr-1"
                    /> ヘッダを含める
                </label>

                {/* 逆マッピングのチェックボックス */}
                <label className="ml-4 text-xs flex items-center">
                    <input
                        type="checkbox"
                        checked={reverseParse}
                        onChange={handleReverseParseChange}
                        className="mr-1"
                    /> リバースマッピングする
                </label>
            </div>
        </>
    ); // 修正: ')' を追加
};

export default MappingDisplayTable;

