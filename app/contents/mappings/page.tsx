// /app/contents/mappings/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainButton } from "@/app/components/MainButton";
import { WhitePanel } from "@/app/components/WhitePanel";
import { FileButton } from '@/app/components/FileButton'; // FileButtonのインポートも忘れずに
import templateFiles from '../../../data/templateFiles.json';

// ファイルオブジェクトのインターフェース
interface FileItem {
    fileId: string;
    fileName: string;
}

// JSON全体の構造を表すインターフェース
interface TemplateFiles {
    gsFiles: FileItem[];
    giosFiles: FileItem[];
}

export default function Page() {
    const [selectedTool, setSelectedTool] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
    const [activeToggle, setActiveToggle] = useState<string | null>(null);
    const router = useRouter();

    // ローカルストレージのキー名
    const SELECTED_TOOL_KEY = 'selectedToolMappingPage';
    const SELECTED_FILES_KEY = 'selectedFilesMappingPage';

    // インポートしたJSONデータをデストラクチャリング
    const { gsFiles, giosFiles } = templateFiles as TemplateFiles;

    // ツール選択時のハンドラー
    const handleToggle = (toolName: string, files: FileItem[]) => {
        if (activeToggle === toolName) {
            // トグルボタンのアクティブ状態を解除
            setActiveToggle(null);
            setSelectedTool(null);
            setSelectedFiles([]);
            localStorage.removeItem(SELECTED_TOOL_KEY);
            localStorage.removeItem(SELECTED_FILES_KEY);
        } else {
            // トグルボタンをアクティブに設定
            setActiveToggle(toolName);
            setSelectedTool(toolName);
            setSelectedFiles(files);
            localStorage.setItem(SELECTED_TOOL_KEY, toolName);
            localStorage.setItem(SELECTED_FILES_KEY, JSON.stringify(files));
        }
    };

    // ページロード時にlocalStorageから状態を復元
    useEffect(() => {
        const savedTool = localStorage.getItem(SELECTED_TOOL_KEY);
        const savedFiles = localStorage.getItem(SELECTED_FILES_KEY);

        if (savedTool && savedFiles) {
            setSelectedTool(savedTool);
            setSelectedFiles(JSON.parse(savedFiles));
            setActiveToggle(savedTool);
        }
    }, []);

    // ファイルクリック時に対応するマッピングページに遷移
    const handleFileClick = (fileName: string) => {
        const fileIdMatch = fileName.match(/【(.+?)】/);
        if (fileIdMatch && fileIdMatch[1]) {
            const fileId = fileIdMatch[1];
            router.push(`/contents/mappings/${fileId}`);
        } else {
            console.error('ファイル名の形式が正しくありません:', fileName);
        }
    };

    return (
        <main className="mb-2 p-4 bg-white shadow-xl rounded-md border border-gray-300">
            <h1 className="text-base font-semibold text-gray-700 mb-4 text-left">Mappings</h1>
            {/* ボタンパネル */}
            <div className="grid grid-cols-5 gap-2">
                {/* GS-EPLAN トグルボタン */}
                <MainButton
                    label="GS-EPLAN"
                    isToggle={true}
                    isActive={activeToggle === "GS-EPLAN"}
                    onToggle={() => handleToggle("GS-EPLAN", gsFiles)}
                />
                {/* GIOS トグルボタン */}
                <MainButton
                    label="GIOS"
                    isToggle={true}
                    isActive={activeToggle === "GIOS"}
                    onToggle={() => handleToggle("GIOS", giosFiles)}
                />

                {/* ダミーボタン */}
                {[...Array(3)].map((_, index) => (
                    <MainButton
                        key={`dummy-${index}`}
                        label=""
                        isDummy={true}
                    />
                ))}
            </div>

            {/* WhitePanelを表示し、選択されたファイルリストを表示 */}
            <div className="h-auto min-h-64 mt-4 p-4 bg-gray-100 rounded-md border border-gray-300">
                {selectedTool && (
                    <WhitePanel height="360px">
                        <h2 className="text-sm font-semibold text-gray-700">{selectedTool}</h2>
                        {/* スクロールがホバーに反応しないようにmin-h-[400px]で十分な高さを指定 */}
                        <div className="overflow-auto max-h-64 min-h-[400px]">
                            <ul className="grid grid-cols-2 gap-y-2 gap-x-2 mt-2">
                                {selectedFiles.map((file) => (
                                    <li key={file.fileId} className="flex justify-start">
                                        <FileButton
                                            fileName={file.fileName}
                                            onClick={() => handleFileClick(file.fileName)}
                                            // 必要に応じてサムネイルやパスを渡すこともできます
                                            // thumbnail={file.thumbnail}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </WhitePanel>
                )}
            </div>
        </main>
    );
}