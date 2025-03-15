// /app/contents/mappings/[fileId]/page.tsx

'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MappingData } from '../types';
import MappingDisplayTable from '../components/MappingDisplayTable';
import MappingModal from '../MappingModal'; // 必要に応じてパスを確認してください
import Tooltip from '../../../components/Tooltip';

// 定数として行数制限を定義
const MAX_ROWS = 1000;

export default function MappingPage() {
    const params = useParams();
    // fileIdがstringまたはstring[]の場合に対応
    const fileId = Array.isArray(params.fileId) ? params.fileId[0] : params.fileId;

    const [inputData, setInputData] = useState<string>(""); // ユーザが入力または貼り付けたデータ
    const [formattedData, setFormattedData] = useState<string[][]>([]); // 成形されたデータ
    const [numColumns, setNumColumns] = useState<number>(0); // 列数
    const [numRows, setNumRows] = useState<number>(0); // 行数
    const [mappingData, setMappingData] = useState<MappingData | null>(null); // マッピングデータの状態
    const [loading, setLoading] = useState<boolean>(false); // ローディング状態
    const [isJapanese, setIsJapanese] = useState<boolean>(true); // ヘッダ切り替え用の状態
    const [includeHeader, setIncludeHeader] = useState<boolean>(true); // ヘッダを含めるかどうか
    const [reverseParse, setReverseParse] = useState<boolean>(true); // 逆マッピング機能
    const [editingCell, setEditingCell] = useState<{ row: number, col: number } | null>(null); // 編集中のセル

    // ツールチップの可視状態と位置を管理
    const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
    const [tooltipPosition, setTooltipPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    const [showModal, setShowModal] = useState<boolean>(false); // モーダルの表示状態
    const [isMappingApplied, setIsMappingApplied] = useState<boolean>(false); // マッピングが適用されたかどうか

    const handleOpenModal = () => setShowModal(true);  // モーダルを開く
    const handleCloseModal = () => setShowModal(false); // モーダルを閉じる

    const [isTemporaryMapping, setIsTemporaryMapping] = useState<boolean>(false); // 一時的マッピング適用フラグ

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault(); // デフォルトのタブ移動を防止
            const textarea = e.target as HTMLTextAreaElement;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            // タブ文字を挿入
            const newValue = inputData.substring(0, start) + '\t' + inputData.substring(end);
            setInputData(newValue);

            // カーソル位置をタブ文字の後に設定
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 1;
            }, 0);
        }
    };

    // 一時的マッピング適用時の処理
    const handleApplyTemporaryMapping = (updatedMappingData: MappingData) => {
        setMappingData(updatedMappingData);            // マッピングデータを更新
        setIsMappingApplied(true);                     // マッピングが適用されたことを示す
        setIsTemporaryMapping(true);                   // 一時マッピングが適用されたことを示す
        handleParse(updatedMappingData);               // 新しいマッピングでテーブルを再構築
        setShowModal(false);                           // モーダルを閉じる
    };

    // ファイルIDに基づいてマッピングデータを取得
    useEffect(() => {
        const loadMappingData = async () => {
            if (fileId) {
                setLoading(true);
                try {
                    let data: MappingData;

                    if (fileId === 'user-mapping') {
                        // 'user-mapping'の場合はローカルストレージから取得
                        const userMappingJSON = localStorage.getItem('userMappingMappingPage');
                        if (userMappingJSON) {
                            const userMapping: MappingData = JSON.parse(userMappingJSON);

                            // 必須プロパティの確認とデフォルト値の設定
                            if (!userMapping.fileName) userMapping.fileName = 'user-mapping';
                            if (!userMapping.tableName) userMapping.tableName = 'user-table';
                            if (!userMapping.tableNameJ) userMapping.tableNameJ = 'ユーザテーブル';
                            if (!userMapping.columns) userMapping.columns = [];

                            data = userMapping;
                        } else {
                            alert("ユーザーマッピングデータが存在しません。");
                            setMappingData(null);
                            return;
                        }
                    } else {
                        // それ以外の場合はAPIから取得
                        const res = await fetch(`/api/getMappingData?fileId=${fileId}`);
                        if (!res.ok) {
                            throw new Error(`HTTP error! status: ${res.status}`);
                        }
                        const fetchedData: MappingData = await res.json();

                        // 必須プロパティの確認とデフォルト値の設定
                        if (!fetchedData.fileName) fetchedData.fileName = 'unknown';
                        if (!fetchedData.tableName) fetchedData.tableName = 'unknown-table';
                        if (!fetchedData.tableNameJ) fetchedData.tableNameJ = '未知のテーブル';
                        if (!fetchedData.columns) fetchedData.columns = [];

                        data = fetchedData; // APIから取得したデータのみを使用
                    }

                    setMappingData(data);
                } catch (err) {
                    console.error('Error fetching mapping data:', err);
                    alert("マッピングデータの取得に失敗しました。");
                    setMappingData(null);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadMappingData();
    }, [fileId]);

    // テキストボックスに貼り付けられたデータを処理
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const pastedData = e.clipboardData.getData('Text');

        // 行数が制限を超えている場合はアラートを表示し、貼り付け処理を中止
        const lines = pastedData.trimEnd().split("\n");
        const lineCount = lines.length;
        if (lineCount > MAX_ROWS) {
            alert(`${MAX_ROWS}行までしか処理できません。データが大きすぎるため、貼り付けをキャンセルしました。`);
            e.preventDefault();
            return;
        }

        // 既存の貼り付け処理に影響を与えず、デフォルトのテキストボックス動作に任せる
        setLoading(true);
        setTimeout(() => {
            document.body.style.cursor = 'default'; // カーソルを戻す
            setLoading(false); // ローディング状態終了
        }, 1000);
    };

    // handleParseを修正し、mappingDataを引数として受け取るように変更
    const handleParse = (currentMappingData: MappingData) => {
        if (!currentMappingData) {
            alert("マッピングデータが取得されていません。");
            return;
        }

        // 既存データがある場合は確認アラートを出す
        if (formattedData.length > 0) {
            if (!window.confirm("現在のデータを破棄して再度マッピングしますか？")) {
                return; // ユーザーがキャンセルした場合は処理を中止
            }
        }

        // 全ての状態をクリアして再スタート
        setFormattedData([]);   // 表データをクリア
        setNumColumns(0);       // 列数をクリア
        setNumRows(0);          // 行数をクリア
        setEditingCell(null);   // 編集セル状態をクリア
        setLoading(true);       // ローディング状態を設定

        // テキストボックスから現在の入力データをロード
        const lines = inputData.split("\n").filter(line => line.trim() !== ""); // 空行は無視する

        // 最大行数を超えている場合はデータをカット
        let processedLines = lines;
        if (lines.length > MAX_ROWS) {
            processedLines = lines.slice(0, MAX_ROWS);
            setInputData(processedLines.join("\n"));
            alert(`${MAX_ROWS}行までしか処理できません。残りのデータは無視されます。`);
        }

        // タブ区切りで各行を分割し、空白タブも含めて処理
        const parsedData = processedLines.map((line) => {
            const columns = line.split("\t"); // 行ごとにタブで分割
            const totalColumns = currentMappingData.columns.length; // 定義された列数に合わせる
            return [...columns, ...Array(Math.max(0, totalColumns - columns.length)).fill("")]; // 足りない列は空文字で補完
        });

        // 行数と列数の設定
        setNumRows(parsedData.length);
        setNumColumns(parsedData[0]?.length || 0);

        // マッピングに基づいて新しいデータを生成
        if (parsedData.length > 0) {
            const mappedData = parsedData.map((row) => {
                return currentMappingData.columns.map((col) => {
                    if (col.filePos > 0 && col.filePos <= row.length) {
                        return row[col.filePos - 1] || ""; // filePosが範囲内の場合、データを取得
                    }
                    return ""; // 範囲外のfilePosは空文字を返す
                });
            });
            setFormattedData(mappedData); // 新しいマッピングデータをセット
        }

        setLoading(false); // ローディング状態を解除
    };

    // 入力データと成形データをクリア
    const handleClear = () => {
        if (window.confirm("画面をクリアしますか？")) {
            setInputData("");
            setFormattedData([]);
            setNumColumns(0);
            setNumRows(0);
        }
    };

    // セルの編集処理
    const handleCellChange = (rowIndex: number, cellIndex: number, value: string) => {
        const updatedData = [...formattedData];
        updatedData[rowIndex][cellIndex] = value;
        setFormattedData(updatedData);
    };

    // セルがダブルクリックされたら編集モードに入る
    const handleCellDoubleClick = (rowIndex: number, cellIndex: number) => {
        setEditingCell({ row: rowIndex, col: cellIndex });
    };

    // 成形データをクリップボードにコピー
    const handleCopyToClipboard = async (e: React.MouseEvent<HTMLButtonElement>) => {
        let textToCopy = formattedData.map((row) => row.join("\t")).join("\n");

        if (reverseParse && mappingData) {
            // リバースマッピング処理
            textToCopy = formattedData.map((row) => {
                const maxFilePos = Math.max(...(mappingData.columns.map((col) => col.filePos) || [0]));
                const originalRow = Array(maxFilePos).fill(""); // マッピング前の列数分の空配列を作成
                row.forEach((cell, index) => {
                    const filePos = mappingData.columns[index]?.filePos;
                    if (filePos > 0) {
                        originalRow[filePos - 1] = cell; // リバースマッピング
                    }
                });
                return originalRow.join("\t");
            }).join("\n");
        }

        // ヘッダを含める場合
        if (includeHeader && mappingData) {
            let headerRow;
            if (reverseParse) {
                const maxFilePos = Math.max(...(mappingData.columns.map((col) => col.filePos) || [0]));
                const originalHeader = Array(maxFilePos).fill("");
                mappingData.columns.forEach((col, index) => {
                    if (col.filePos > 0) {
                        originalHeader[col.filePos - 1] = isJapanese ? col.hdNameJ : col.hdName;
                    }
                });
                headerRow = originalHeader.join("\t");
            } else {
                headerRow = mappingData.columns.map(col => (isJapanese ? col.hdNameJ : col.hdName)).join("\t");
            }
            textToCopy = headerRow + "\n" + textToCopy + "\n"; // ヘッダの逆マッピング処理を条件に適用
        }

        try {
            await navigator.clipboard.writeText(textToCopy);
            showTooltip(e); // ツールチップを表示
        } catch (error) {
            alert("クリップボードへのコピーに失敗しました。"); // 失敗メッセージ
        }
    };

    // クリップボードにコピーされた際のツールチップの表示
    const showTooltip = (event: React.MouseEvent<HTMLButtonElement>) => {
        const tooltipX = event.clientX + 10; // マウスのさらに右上にツールチップを表示
        const tooltipY = event.clientY - 50;
        setTooltipPosition({ x: tooltipX, y: tooltipY });
        setTooltipVisible(true); // ツールチップを表示
        setTimeout(() => setTooltipVisible(false), 1000); // 1秒後に非表示
    };

    // 成形データをCSV形式でダウンロード
    const handleDownload = () => {
        let textToDownload = formattedData.map((row) => row.join("\t")).join("\n");

        if (reverseParse && mappingData) {
            // 逆マッピング処理
            textToDownload = formattedData.map((row) => {
                const maxFilePos = Math.max(...(mappingData.columns.map((col) => col.filePos) || [0]));
                const originalRow = Array(maxFilePos).fill(""); // マッピング前の列数分の空配列を作成
                row.forEach((cell, index) => {
                    const filePos = mappingData.columns[index]?.filePos;
                    if (filePos > 0) {
                        originalRow[filePos - 1] = cell; // 逆マッピング
                    }
                });
                return originalRow.join("\t");
            }).join("\n");
        }

        // ヘッダを含める場合
        if (includeHeader && mappingData) {
            let headerRow;
            if (reverseParse) {
                const maxFilePos = Math.max(...(mappingData.columns.map((col) => col.filePos) || [0]));
                const originalHeader = Array(maxFilePos).fill("");
                mappingData.columns.forEach((col, index) => {
                    if (col.filePos > 0) {
                        originalHeader[col.filePos - 1] = isJapanese ? col.hdNameJ : col.hdName;
                    }
                });
                headerRow = originalHeader.join("\t");
            } else {
                headerRow = mappingData.columns.map(col => (isJapanese ? col.hdNameJ : col.hdName)).join("\t");
            }
            textToDownload = headerRow + "\n" + textToDownload + "\n"; // ヘッダの逆マッピング処理を条件に適用
        }

        const blob = new Blob([textToDownload], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "formatted_data_" + fileId + ".csv"; // ダウンロードするファイル名
        a.click();
        URL.revokeObjectURL(url); // 一時URLを解放
    };

    // ヘッダの表示言語を切り替える
    const toggleHeader = () => {
        setIsJapanese(!isJapanese);
    };

    // チェックボックスの変更ハンドラー
    const handleIncludeHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIncludeHeader(e.target.checked);
    };

    const handleReverseParseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReverseParse(e.target.checked);
    };

    // マッピングデータがロードされていない場合はローディングを表示
    if (!mappingData) {
        return <div>Loading...</div>;
    }

    // マッピングデータを再取得して設定する関数を async に変更
    const reloadMappingData = async (): Promise<MappingData | null> => {
        if (fileId && fileId !== 'user-mapping') {
            setLoading(true);
            try {
                const res = await fetch(`/api/getMappingData?fileId=${fileId}`);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const fetchedData: MappingData = await res.json();

                // 必須プロパティの確認とデフォルト値の設定
                if (!fetchedData.fileName) fetchedData.fileName = 'unknown';
                if (!fetchedData.tableName) fetchedData.tableName = 'unknown-table';
                if (!fetchedData.tableNameJ) fetchedData.tableNameJ = '未知のテーブル';
                if (!fetchedData.columns) fetchedData.columns = [];

                setMappingData(fetchedData); // マッピングデータを再取得して設定
                setIsTemporaryMapping(false); // 一時マッピングフラグをリセット
                return fetchedData;
            } catch (err) {
                console.error('Error fetching mapping data', err);
                alert("マッピングデータの取得に失敗しました。");
                return null;
            } finally {
                setLoading(false);
            }
        }
        return null;
    };

    // 一時適用を解除する関数を async に変更
    const handleRemoveTemporaryMapping = async () => {
        if (window.confirm("一時適用を解除します")) {
            const originalMappingData = await reloadMappingData(); // 元のマッピングデータを再取得
            if (originalMappingData) {
                handleParse(originalMappingData);             // テーブルを再構築
            }
        }
    };

    return (
        <div className={`container mx-auto p-4 shadow-xl rounded-md border border-gray-300 bg-gray-50 ${loading ? "cursor-wait" : ""}`}>
            {/* ページの見出し */}
            <h1 className="text-base font-semibold">{mappingData.fileName}</h1>

            {/* タブ区切りデータの入力部分 */}
            <h2 className="mt-5 text-sm font-semibold mb-1">タブ区切りデータの入力 ({fileId})</h2>

            <textarea
                className="w-full h-40 p-1 border border-gray-300 mb-0 text-xs overflow-x-auto"
                style={{ whiteSpace: 'nowrap', fontFamily: 'monospace' }} // 横スクロールを適用
                value={inputData}
                onKeyDown={handleKeyDown}
                onChange={(e) => setInputData(e.target.value)}
                onPaste={handlePaste} // ペーストイベントを監視
                placeholder={`表データ（タブ区切り）を貼り付けてください (最大${MAX_ROWS}行)`}
            ></textarea>

            {/* ボタン群を左右に分けるためのフレックスコンテナ */}
            <div className="flex justify-between items-center space-x-2 mb-2">
                {/* 左側のボタン群 */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleParse(mappingData)}
                        className="px-2 py-1 text-xs bg-gray-600 text-white rounded-md shadow-md hover:bg-gray-700 active:bg-gray-800 transition-all"
                    >
                        データマッピング
                    </button>

                    <button
                        onClick={handleClear}
                        className="px-2 py-1 text-xs bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600 active:bg-gray-700 transition-all"
                        disabled={!inputData}
                    >
                        クリア
                    </button>

                    <button
                        onClick={() => window.history.back()}
                        className="px-2 py-1 text-xs bg-gray-600 text-white rounded-md shadow-md hover:bg-gray-700 active:bg-gray-800 transition-all"
                    >
                        戻る
                    </button>
                </div>

                {/* 右側のボタン群 */}
                <div className="flex space-x-2">
                    {/* 一時適用を解除ボタン: 一時マッピングが適用されている場合のみ表示 */}
                    {isTemporaryMapping && (
                        <button
                            onClick={handleRemoveTemporaryMapping}
                            className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 active:bg-blue-700 transition-all"
                        >
                            一時適用を解除
                        </button>
                    )}

                    {/* マッピング定義ボタン */}
                    <button
                        onClick={handleOpenModal}
                        className="px-2 py-1 text-xs bg-gray-600 text-white rounded-md shadow-md hover:bg-gray-700 active:bg-gray-800 transition-all"
                    >
                        マッピング定義
                    </button>
                </div>
            </div>

            {/* モーダル表示 */}
            {showModal && mappingData && (
                <MappingModal
                    onClose={handleCloseModal}
                    onApplyTemporaryMapping={handleApplyTemporaryMapping}
                    mappingData={mappingData}
                />
            )}

            {numColumns > 0 && mappingData?.columns?.length > 0 && (
                <p className="mb-2 text-xs">
                    行数: {numRows}, 列数: {numColumns}, 出力列数: {mappingData.columns.length}
                </p>
            )}

            {formattedData.length > 0 && mappingData && (
                <MappingDisplayTable
                    formattedData={formattedData}
                    mappingData={mappingData}
                    isJapanese={isJapanese}
                    toggleHeader={toggleHeader}
                    includeHeader={includeHeader}
                    reverseParse={reverseParse}
                    handleCopyToClipboard={handleCopyToClipboard}
                    handleDownload={handleDownload}
                    handleIncludeHeaderChange={handleIncludeHeaderChange}
                    handleReverseParseChange={handleReverseParseChange}
                    handleCellChange={handleCellChange}
                    handleCellDoubleClick={handleCellDoubleClick}
                    editingCell={editingCell}
                    setEditingCell={setEditingCell}
                    isTemporaryMapping={isTemporaryMapping}
                />
            )}

            {/* ツールチップ表示 */}
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
    ); // 修正: ')' を追加
}

