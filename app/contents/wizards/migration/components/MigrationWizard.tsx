// /app/contents/wizards/migration/components/MigrationWizard.tsx

 'use client';

 import React, { useState, useEffect, useCallback, useMemo } from 'react';
 import Step1 from './Step1';
 import StepList from './StepList';
 import StepSettingsPanel from './StepSettingsPanel/StepSettingsPanel';
 import CustomDropdown from './CustomDropdown/CustomDropdown';
 import DataExport from './DataExport';
 import DataImport from './DataImport';
 import Notification from '../../../../components/Notification';
 import { Step, StepDetails } from '../types';
 import categoriesData from '../data/categories.json';
 import { useDownloadExcel } from './useDownloadExcel';
 
 export default function MigrationWizard() {
   // 基本情報のステート
   const [title, setTitle] = useState<string>('');
   const [workDate, setWorkDate] = useState<string>('');
   const [startTime, setStartTime] = useState<string>('');
   const [requiredTime, setRequiredTime] = useState<string>('');
   const [workerA, setWorkerA] = useState<string>('');
   const [workerB, setWorkerB] = useState<string>('');
 
   // カスタムフックから関数と状態を取得
   const { handleDownloadExcel, loading } = useDownloadExcel();
 
   // 通知表示のためのステート
   const [notification, setNotification] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
 
   // 手順のステート
   const [steps, setSteps] = useState<Step[]>([]);
   const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
 
   // 連番を振るためのID管理
   const [nextId, setNextId] = useState<number>(1);
 
   // ローカルストレージキー
   const LOCAL_STORAGE_KEY = 'selectedToolMigrationWizard';
 
   // ロード完了フラグ
   const [loaded, setLoaded] = useState<boolean>(false);
 
   // 保存するデータの準備（useMemoを使用して依存関係を安定させる）
   const dataToSave = useMemo(() => ({
     title,
     workDate,
     startTime,
     requiredTime,
     workerA,
     workerB,
     steps,
     activeStepIndex,
     nextId,
   }), [title, workDate, startTime, requiredTime, workerA, workerB, steps, activeStepIndex, nextId]);
 
   // 通知を表示する関数
   const showNotification = useCallback((message: string) => {
     console.log('Notification:', message);
     setNotification({ message, visible: true });
   }, []);
 
   // 通知を閉じる関数
   const closeNotification = useCallback(() => {
     setNotification((prev) => ({ ...prev, visible: false }));
   }, []);
 
   // データを保存する関数（通知を表示するかどうかを制御）
   const saveDataToLocalStorage = useCallback((showNotify = false) => {
     if (typeof window !== 'undefined') {
       try {
         console.log('Saving data to localStorage:', dataToSave);
         localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
         if (showNotify) {
           showNotification('データを保存しました。');
         }
       } catch (error) {
         console.error('データの保存に失敗しました:', error);
         if (showNotify) {
           showNotification('データの保存に失敗しました。');
         }
       }
     }
   }, [dataToSave, showNotification]);
 
   // データを読み込む関数
   const loadDataFromLocalStorage = useCallback(() => {
     if (typeof window !== 'undefined') {
       try {
         const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
         console.log('Loading data from localStorage:', savedData);
         if (savedData) {
           const parsedData = JSON.parse(savedData);
           setTitle(parsedData.title || '');
           setWorkDate(parsedData.workDate || '');
           setStartTime(parsedData.startTime || '');
           setRequiredTime(parsedData.requiredTime || '');
           setWorkerA(parsedData.workerA || '');
           setWorkerB(parsedData.workerB || '');
           setSteps(parsedData.steps || []);
           setNextId(parsedData.nextId || 1);
           setActiveStepIndex(
             typeof parsedData.activeStepIndex === 'number' &&
             parsedData.activeStepIndex >= 0 &&
             parsedData.activeStepIndex < (parsedData.steps || []).length
               ? parsedData.activeStepIndex
               : null
           );
         } else {
           showNotification('保存されたデータがありません。');
         }
       } catch (error) {
         console.error('データの復元に失敗しました:', error);
         showNotification('データの復元に失敗しました。');
       }
     }
   }, [showNotification]);
 
   // 画面の状態をクリアする関数
   const clearState = useCallback(() => {
     // 状態をリセット
     setTitle('');
     setWorkDate('');
     setStartTime('');
     setRequiredTime('');
     setWorkerA('');
     setWorkerB('');
     setSteps([]);
     setNextId(1);
     setActiveStepIndex(null);
 
     // ローカルストレージからデータを削除
     if (typeof window !== 'undefined') {
       localStorage.removeItem(LOCAL_STORAGE_KEY);
     }
 
     showNotification('データをクリアしました。');
   }, [showNotification]);
 
   // 完了ボタンのハンドラー
   const handleComplete = () => {
     // メッセージを表示
     showNotification('この機能でEXCELの手順書を作成する予定です。');
 
     // Excelダウンロード処理を実行
     handleDownloadExcel();
   };
 
   // 通知を自動的に非表示にするための useEffect
   useEffect(() => {
     if (notification.visible) {
       const timer = setTimeout(() => {
         closeNotification();
       }, 2000); // 2秒後に自動的に消える
       return () => clearTimeout(timer);
     }
   }, [notification.visible, closeNotification]);
 
   // データのインポートハンドラー
   const handleDataImport = (importedData: any) => {
     // データのバリデーションと設定
     setTitle(importedData.title || '');
     setWorkDate(importedData.workDate || '');
     setStartTime(importedData.startTime || '');
     setRequiredTime(importedData.requiredTime || '');
     setWorkerA(importedData.workerA || '');
     setWorkerB(importedData.workerB || '');
     setSteps(importedData.steps || []);
     setNextId(importedData.nextId || 1);
 
     // activeStepIndex のバリデーション
     if (
       typeof importedData.activeStepIndex === 'number' &&
       importedData.activeStepIndex >= 0 &&
       importedData.activeStepIndex < (importedData.steps || []).length
     ) {
       setActiveStepIndex(importedData.activeStepIndex);
     } else {
       setActiveStepIndex(null);
     }
 
     showNotification('データをアップロードしました。');
 
     // インポートしたデータをローカルストレージにも保存
     if (typeof window !== 'undefined') {
       try {
         console.log('Importing data to localStorage:', importedData);
         localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(importedData));
       } catch (error) {
         console.error('データの保存に失敗しました:', error);
         showNotification('データの保存に失敗しました。');
       }
     }
   };
 
   // ページが読み込まれたときに localStorage から状態を復元
   useEffect(() => {
     loadDataFromLocalStorage();
     setLoaded(true);
   }, [loadDataFromLocalStorage]);
 
   // データが変更されたらローカルストレージに保存（通知なし）
   useEffect(() => {
     if (loaded) { // ロード完了後にのみ保存
       saveDataToLocalStorage(false);
     }
   }, [title, workDate, startTime, requiredTime, workerA, workerB, steps, activeStepIndex, nextId, loaded, saveDataToLocalStorage]);
 
   // 手順をプルダウンから追加
   const addStepFromDropdown = (step: string) => {
     if (!step) return;
     const newStep: Step = {
       id: nextId,
       name: step,
       details: {},
     };
     setSteps((prevSteps) => {
       const updatedSteps = [...prevSteps, newStep];
       setActiveStepIndex(updatedSteps.length - 1); // 追加されたステップをアクティブに設定
       return updatedSteps;
     });
     setNextId((prevId) => prevId + 1);
   };
 
   // リストの並び替え
   const moveStep = (direction: number) => {
     if (activeStepIndex === null) return;
 
     const newSteps = [...steps];
     const [movedStep] = newSteps.splice(activeStepIndex, 1);
     const newIndex = activeStepIndex + direction;
 
     // 範囲チェック
     if (newIndex < 0 || newIndex >= newSteps.length + 1) return;
 
     newSteps.splice(newIndex, 0, movedStep);
     setSteps(newSteps);
     setActiveStepIndex(newIndex);
   };
 
   // リストの削除（確認ダイアログ付き）
   const deleteStep = () => {
     if (activeStepIndex === null) return;
 
     const confirmDelete = window.confirm('このステップを削除しますか？');
     if (confirmDelete) {
       const newSteps = [...steps];
       newSteps.splice(activeStepIndex, 1);
       setSteps(newSteps);
       setActiveStepIndex(null);
     }
   };
 
   // ステップの詳細情報を更新
   const updateStepDetails = (updatedDetails: StepDetails) => {
     if (activeStepIndex === null) return;
     const updatedSteps = [...steps];
     updatedSteps[activeStepIndex].details = {
       ...updatedSteps[activeStepIndex].details,
       ...updatedDetails,
     };
     setSteps(updatedSteps);
   };
 
   // 所要時間の合計を計算
   const totalTime = steps.reduce(
     (acc, step) => acc + (step.details.duration || 0),
     0
   );
 
   return (
     <div className="p-4 bg-white rounded-md border border-gray-300 shadow-md relative">
       <h1 className="text-sm font-medium mb-2">本番移行手順書作成</h1>
 
       <Step1
         title={title}
         setTitle={setTitle}
         workDate={workDate}
         setWorkDate={setWorkDate}
         startTime={startTime}
         setStartTime={setStartTime}
         requiredTime={requiredTime}
         setRequiredTime={setRequiredTime}
         workerA={workerA}
         setWorkerA={setWorkerA}
         workerB={workerB}
         setWorkerB={setWorkerB}
       />
 
       {/* 手順構築パネル */}
       <div className="flex mt-4">
         {/* 左側の手順リストと追加ボタン */}
         <div className="w-1/3 p-4 bg-gray-50 rounded-md border border-gray-300 shadow-md">
           <h3 className="text-sm font-medium mb-2">手順構築</h3>
 
           {/* ドロップダウンを横幅に合わせて配置 */}
           <div className="mb-1">
             <CustomDropdown categories={categoriesData} onSelect={addStepFromDropdown} />
           </div>
 
           {/* ステップリストと間隔を設ける */}
           <div className="mt-1">
             <StepList
               steps={steps}
               activeStepIndex={activeStepIndex}
               setActiveStepIndex={setActiveStepIndex}
               moveStep={moveStep}
               deleteStep={deleteStep}
             />
           </div>
 
           {/* 上下および削除ボタンと所要時間の合計 */}
           <div className="flex justify-between items-center mt-2">
             <div className="flex space-x-2">
               <button
                 className="text-xs px-2 py-1 border rounded hover:bg-gray-200 disabled:bg-gray-100 transform transition-transform duration-100 hover:translate-x-0.5 hover:translate-y-0.5"
                 onClick={() => moveStep(-1)}
                 disabled={activeStepIndex === null || activeStepIndex === 0}
                 aria-label="上に移動"
               >
                 ▲
               </button>
               <button
                 className="text-xs px-2 py-1 border rounded hover:bg-gray-200 disabled:bg-gray-100 transform transition-transform duration-100 hover:translate-x-0.5 hover:translate-y-0.5"
                 onClick={() => moveStep(1)}
                 disabled={
                   activeStepIndex === null ||
                   activeStepIndex === steps.length - 1
                 }
                 aria-label="下に移動"
               >
                 ▼
               </button>
               <button
                 className="text-xs px-2 py-1 border rounded bg-red-500 text-white hover:bg-red-600 transform transition-transform duration-100 hover:translate-x-0.5 hover:translate-y-0.5"
                 onClick={deleteStep}
                 disabled={activeStepIndex === null}
                 aria-label="削除"
               >
                 削除
               </button>
             </div>
             <div className="text-xs text-right">
               所要時間合計 <span className="font-bold">{totalTime}</span> 分
             </div>
           </div>
         </div>
 
         {/* 右側の設定パネル (幅2/3) */}
         <div className="w-2/3 pl-4">
           {activeStepIndex !== null && (
             <StepSettingsPanel
               step={steps[activeStepIndex]}
               stepNumber={activeStepIndex + 1}
               updateStepDetails={updateStepDetails}
             />
           )}
         </div>
       </div>
 
       {/* 完了ボタンとデータの保存・読み込み・クリアボタン */}
       <div className="flex justify-end mt-4 space-x-2">
         {/* クリアボタン */}
         <button
           className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transform transition-transform duration-100 hover:translate-x-0.5 hover:translate-y-0.5"
           onClick={() => {
             const confirmClear = window.confirm('データをクリアします');
             if (confirmClear) {
               clearState();
             }
           }}
           aria-label="クリア"
         >
           クリア
         </button>
         {/* アップロードボタン */}
         <DataImport
           onDataImport={handleDataImport}
           className="px-3 py-1 text-xs bg-purple-500 text-white rounded cursor-pointer hover:bg-purple-600 transform transition-transform duration-100 hover:translate-x-0.5 hover:translate-y-0.5"
         />
         {/* ダウンロードボタン */}
         <DataExport
           data={dataToSave}
           className="px-3 py-1 text-xs bg-indigo-500 text-white rounded hover:bg-indigo-600 transform transition-transform duration-100 hover:translate-x-0.5 hover:translate-y-0.5"
         />
         {/* 完了ボタン */}
         <button
           className="px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-800 transform transition-transform duration-100 hover:translate-x-0.5 hover:translate-y-0.5"
           onClick={handleComplete}
           aria-label="EXCEL手順書作成"
           disabled={loading} // ローディング中はボタンを無効化
         >
           {loading ? 'Downloading...' : 'EXCEL手順書作成'}
         </button>
       </div>
 
       {/* Notification Component */}
       <Notification message={notification.message} visible={notification.visible} onClose={closeNotification} />
     </div>
   );
 }
 