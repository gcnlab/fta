// /app/contents/wizards/ReleaseManual/components/Step1.tsx

import React from 'react';

interface Step1Props {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  workDate: string;
  setWorkDate: React.Dispatch<React.SetStateAction<string>>;
  startTime: string;
  setStartTime: React.Dispatch<React.SetStateAction<string>>;
  requiredTime: string;
  setRequiredTime: React.Dispatch<React.SetStateAction<string>>;
  workerA: string;
  setWorkerA: React.Dispatch<React.SetStateAction<string>>;
  workerB: string;
  setWorkerB: React.Dispatch<React.SetStateAction<string>>;
}

const Step1: React.FC<Step1Props> = ({
  title,
  setTitle,
  workDate,
  setWorkDate,
  startTime,
  setStartTime,
  requiredTime,
  setRequiredTime,
  workerA,
  setWorkerA,
  workerB,
  setWorkerB,
}) => {
  return (
    <div className="p-4 mb-4 bg-gray-50 rounded-md border border-gray-300 shadow-md">
      <h2 className="text-sm font-medium mb-2">基本情報</h2>

      {/* タイトル行 */}
      <div className="mb-2">
        <input
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
      </div>

      {/* 2行目 (入力フィールド) */}
      <div className="flex items-center space-x-4 mb-1">
        <div className="flex items-center">
          <label className="text-xs text-right font-normal mr-1">実施日</label>
          <input
            type="date"
            value={workDate}
            onChange={(e) => setWorkDate(e.target.value)}
            className="px-2 py-1 text-xs w-32 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div className="flex items-center">
          <label className="text-xs text-right font-normal mr-1">開始時刻</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="px-2 py-1 text-xs w-24 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div className="flex items-center">
          <label className="text-xs text-right font-normal mr-1">所要時間</label>
          <input
            type="number"
            value={requiredTime}
            onChange={(e) => setRequiredTime(e.target.value)}
            className="px-2 py-1 text-end text-xs w-16 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <span className="ml-1 text-xs">分</span>
        </div>

        <div className="flex items-center">
          <label className="text-xs text-right font-normal mr-1">作業者A</label>
          <input
            type="text"
            placeholder="作業者A"
            value={workerA}
            onChange={(e) => setWorkerA(e.target.value)}
            className="px-2 py-1 text-xs w-32 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div className="flex items-center">
          <label className="text-xs text-right font-normal mr-1">作業者B</label>
          <input
            type="text"
            placeholder="作業者B"
            value={workerB}
            onChange={(e) => setWorkerB(e.target.value)}
            className="px-2 py-1 text-xs w-32 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Step1);

