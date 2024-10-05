// /app/contents/templates/page.tsx

"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MainButton } from '@/app/components/MainButton';
import { WhitePanel } from '@/app/components/WhitePanel';
import templateFiles from '../../../data/templateFiles.json'; // パスを確認

export default function Page() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // ホバーされたリンクのインデックスを管理
    const [isLocked, setIsLocked] = useState<boolean>(false); // Shiftキー押下時にサムネイル表示を固定
    const [modalImage, setModalImage] = useState<string | null>(null); // 拡大画像のためのモーダル表示
    const [windowWidth, setWindowWidth] = useState<number>(0); // 画面サイズの監視用
    const [isMappingSheet, setIsMappingSheet] = useState<boolean>(true); // Mapping SheetsかTemplatesかの判定
    const [showContextMenu, setShowContextMenu] = useState<{ x: number; y: number; index: number | null } | null>(null); // コンテキストメニュー表示用
    const [selectedFile, setSelectedFile] = useState<any | null>(null);
    const [selectedTool, setSelectedTool] = useState<string | null>(null); // 選択されたボタンの状態
    const [activeToggle, setActiveToggle] = useState<string | null>(null); // アクティブなトグルボタンのラベル

    const router = useRouter(); // ページ遷移用

    const SELECTED_TOOL_KEY = 'selectedToolTemplates';

    const handleButtonClick = (toolName: string) => {
        if (activeToggle === toolName) {
            // トグルボタンのアクティブ状態を解除
            setActiveToggle(null);
            setSelectedTool(null);
            localStorage.removeItem(SELECTED_TOOL_KEY);
        } else {
            // トグルボタンをアクティブに設定
            setActiveToggle(toolName);
            setSelectedTool(toolName);
            localStorage.setItem(SELECTED_TOOL_KEY, toolName);
        }
    };

    // ページが読み込まれたときに localStorage から状態を復元
    useEffect(() => {
        const savedTool = localStorage.getItem(SELECTED_TOOL_KEY);
        if (savedTool) {
            setSelectedTool(savedTool);
            setActiveToggle(savedTool);
        }
    }, []);

    const contextMenuRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // 画面サイズを監視して、サムネイルのサイズを調整する
    useEffect(() => {
        const updateWindowWidth = () => {
            setWindowWidth(window.innerWidth);
        };
        updateWindowWidth();
        window.addEventListener('resize', updateWindowWidth);
        return () => window.removeEventListener('resize', updateWindowWidth);
    }, []);

    // Shiftキーでサムネイル表示を固定するイベント
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Shift") {
            setIsLocked(true);
        }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
        setIsLocked(false);
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    // コンテキストメニューの外側をクリックしたときに閉じる
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
                setShowContextMenu(null);
            }
        };
        if (showContextMenu) {
            window.addEventListener('mousedown', handleClickOutside);
        } else {
            window.removeEventListener('mousedown', handleClickOutside);
        }
        return () => window.removeEventListener('mousedown', handleClickOutside);
    }, [showContextMenu]);

    // ホバーされたリンクに基づいてサムネイルを表示
    const handleMouseEnter = (index: number, isMapping: boolean) => {
        if (!isLocked) {
            setHoveredIndex(index);
            setIsMappingSheet(isMapping);
        }
    };

    const handleMouseLeave = () => {
        if (!isLocked) {
            setHoveredIndex(null);
        }
    };

    // サムネイルクリックで拡大画像をモーダル表示
    const handleThumbnailClick = (thumbnail: string) => {
        setModalImage(thumbnail);
    };

    const handleModalClose = () => {
        setModalImage(null);
    };

    // 右クリックメニューを表示する
    const handleContextMenu = (event: React.MouseEvent, index: number, file: { fileId: string; fileName: string; path: string; thumbnail: string }) => {
        event.preventDefault();
        setShowContextMenu({ x: event.pageX, y: event.pageY, index });
        setSelectedFile(file); // 選択したファイルを保存
    };

    // 「ブラウザでマッピング」を選択した時の処理
    const handleMappingClick = () => {
        if (selectedFile && selectedFile.fileId) {
            const fileId = selectedFile.fileId;
            router.push(`/contents/mappings/${fileId}`);
        } else {
            console.error('ファイルが選択されていません');
        }
    };

    // サムネイルの取得関数
    const getThumbnail = () => {
        if (hoveredIndex === null || !selectedTool) return "";
        switch (selectedTool) {
            case "GS-EPLAN":
                return templateFiles.gsFiles[hoveredIndex]?.thumbnail || "";
            case "GIOS":
                return templateFiles.giosFiles[hoveredIndex]?.thumbnail || "";
            case "設計書":
                return templateFiles.templates1[hoveredIndex]?.thumbnail || "";
            case "メモ":
                return templateFiles.templates2[hoveredIndex]?.thumbnail || "";
            default:
                return "";
        }
    };

    return (
        <div tabIndex={0}>
            <main className="bg-gray-100">
                <div className="mb-2 p-4 bg-white shadow-lg rounded-md border border-gray-300">
                    <h1 className="text-base font-semibold text-gray-700 mb-4 text-left">Templates</h1>

                    {/* ボタンパネル */}
                    <div className="grid grid-cols-5 gap-2">
                        <p className="mr-4 text-xs font-semibold text-end">Mapping Sheets</p>
                        <MainButton
                            label="GS-EPLAN"
                            isToggle={true}
                            isActive={activeToggle === "GS-EPLAN"}
                            onToggle={() => handleButtonClick("GS-EPLAN")}
                        />
                        <MainButton
                            label="GIOS"
                            isToggle={true}
                            isActive={activeToggle === "GIOS"}
                            onToggle={() => handleButtonClick("GIOS")}
                        />
                        <MainButton label="" isDummy={true} />
                        <MainButton label="" isDummy={true} />
                        <p className="mr-4 text-xs font-semibold text-end">Templates</p>
                        <MainButton
                            label="設計書"
                            isToggle={true}
                            isActive={activeToggle === "設計書"}
                            onToggle={() => handleButtonClick("設計書")}
                        />
                        <MainButton
                            label="メモ"
                            isToggle={true}
                            isActive={activeToggle === "メモ"}
                            onToggle={() => handleButtonClick("メモ")}
                        />
                        {[...Array(2)].map((_, index) => (
                            <MainButton key={index} label="&nbsp;" isDummy={true} />
                        ))}
                    </div>

                    {/* WhitePanelの表示 */}
                    <div className="h-auto min-h-64 mt-4 p-4 bg-gray-100 rounded-md border border-gray-300 overflow-auto" style={{ maxHeight: "500px" }}>
                        {selectedTool && (
                            <WhitePanel height="360px"> {/* 高さを指定 */}
                                <div className="flex">
                                    {/* 3/4幅: リスト表示 */}
                                    <div className="w-3/4">
                                        <h2 className="text-sm font-semibold text-gray-700">{selectedTool}</h2>
                                        <div className="mt-4">
                                            {/* GS-EPLAN */}
                                            {selectedTool === "GS-EPLAN" && (
                                                <ul className="grid grid-cols-2 gap-2"> {/* 2列レイアウト */}
                                                    {templateFiles.gsFiles.map((file, index) => (
                                                        <li key={file.fileId} className="text-sm cursor-pointer"
                                                            onMouseEnter={() => handleMouseEnter(index, true)}
                                                            onMouseLeave={handleMouseLeave}
                                                            onContextMenu={(e) => handleContextMenu(e, index, file)}>
                                                            <Link href={file.path} className="text-xs block bg-white text-blue-800 hover:bg-blue-50 p-0.5 rounded-md shadow-sm">
                                                                {file.fileName}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {/* GIOS */}
                                            {selectedTool === "GIOS" && (
                                                <ul className="grid grid-cols-2 gap-2"> {/* グリッドクラスを追加 */}
                                                    {templateFiles.giosFiles.map((file, index) => (
                                                        <li key={file.fileId} className="text-sm cursor-pointer"
                                                            onMouseEnter={() => handleMouseEnter(index, true)}
                                                            onMouseLeave={handleMouseLeave}
                                                            onContextMenu={(e) => handleContextMenu(e, index, file)}>
                                                            <Link href={file.path} className="text-xs block bg-white text-blue-800 hover:bg-blue-50 p-0.5 rounded-md shadow-sm">
                                                                {file.fileName}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {/* 設計書 */}
                                            {selectedTool === "設計書" && (
                                                <ul className="grid grid-cols-2 gap-2"> {/* グリッドクラスを追加 */}
                                                    {templateFiles.templates1.map((file, index) => (
                                                        <li key={file.fileId} className="text-sm cursor-pointer"
                                                            onMouseEnter={() => handleMouseEnter(index, false)}
                                                            onMouseLeave={handleMouseLeave}
                                                            onContextMenu={(e) => handleContextMenu(e, index, file)}>
                                                            <Link href={file.path} className="text-xs block bg-white text-blue-800 hover:bg-blue-50 p-0.5 rounded-md shadow-sm">
                                                                {file.fileName}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {/* メモ */}
                                            {selectedTool === "メモ" && (
                                                <ul className="grid grid-cols-2 gap-2"> {/* グリッドクラスを追加 */}
                                                    {templateFiles.templates2.map((file, index) => (
                                                        <li key={file.fileId} className="text-sm cursor-pointer"
                                                            onMouseEnter={() => handleMouseEnter(index, false)}
                                                            onMouseLeave={handleMouseLeave}
                                                            onContextMenu={(e) => handleContextMenu(e, index, file)}>
                                                            <Link href={file.path} className="text-xs block bg-white text-blue-800 hover:bg-blue-50 p-0.5 rounded-md shadow-sm">
                                                                {file.fileName}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                    {/* 1/4幅: サムネイル表示 */}
                                    {hoveredIndex !== null && (
                                        <div className="w-1/4 flex justify-center items-center">
                                            <img
                                                src={getThumbnail()}
                                                alt="サムネイル"
                                                className="object-contain max-h-64 border border-gray-300 shadow-md"
                                            />
                                        </div>
                                    )}
                                </div>
                            </WhitePanel>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
