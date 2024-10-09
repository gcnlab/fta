// /app/contents/tools/components/TimeZoneViewer.tsx

"use client";

import { useState, useEffect } from 'react';
import { ClipboardIcon } from '@heroicons/react/outline'; // アイコンのインポート
import TimeZoneBar from '../../../components/TimeZoneBar';
import timezones from '../../../../data/timezones.json';
import Tooltip from '@/app/components/Tooltip';

const TIMEZONE_VIEWER_STORAGE_KEY = "timeZoneViewerState";

interface TimeZoneViewerState {
  selectedDate: string; // ISO 文字列として保存
  selectedCellText: string;
  activeCell: { label: string; hour: number; index: number } | null;
}

const TimeZoneViewer: React.FC = () => {
  const getInitialState = (): TimeZoneViewerState => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(TIMEZONE_VIEWER_STORAGE_KEY);
      if (savedState) {
        try {
          return JSON.parse(savedState) as TimeZoneViewerState;
        } catch (error) {
          console.error("ローカルストレージからの状態復元に失敗しました:", error);
        }
      }
    }
    return {
      selectedDate: new Date().toISOString(),
      selectedCellText: '',
      activeCell: null,
    };
  };

  const initialState = getInitialState();

  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date(initialState.selectedDate));
  const [selectedCellText, setSelectedCellText] = useState<string>(initialState.selectedCellText);
  const [activeCell, setActiveCell] = useState<{ label: string; hour: number; index: number } | null>(initialState.activeCell);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const stateToSave: TimeZoneViewerState = {
      selectedDate: selectedDate.toISOString(),
      selectedCellText,
      activeCell,
    };
    localStorage.setItem(TIMEZONE_VIEWER_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [selectedDate, selectedCellText, activeCell]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateValue = e.target.value;
    const newDate = newDateValue ? new Date(newDateValue) : new Date();

    if (!isNaN(newDate.getTime())) {
      setSelectedDate(newDate);
      if (activeCell) {
        updateText(activeCell, newDate);
      }
    }
  };

  const updateText = (cellInfo: { label: string; hour: number; index: number }, newDate: Date) => {
    const { label, hour, index } = cellInfo;
    const timezone = timezones.find((tz) => tz.label === label);
    if (!timezone) return;

    const cellIndex = index;
    const selectedZoneTime = `${hour}:00`;

    const jstHour = (cellIndex + 9) % 24;
    const jstTime = `${jstHour}:00`;

    const jstDate = new Date(newDate);
    jstDate.setUTCHours(jstHour);
    if (jstHour < 9) {
      jstDate.setDate(jstDate.getDate() + 1);
    }

    const zoneDate = new Date(newDate);
    const timeDifference = 24 - cellIndex;

    if (timezone.offset >= 0) {
      if (timeDifference > timezone.offset) {
        zoneDate.setDate(newDate.getDate());
      } else {
        zoneDate.setDate(newDate.getDate() + 1);
      }
    } else {
      if (timeDifference - timezone.offset <= 24) {
        zoneDate.setDate(newDate.getDate());
      } else {
        zoneDate.setDate(newDate.getDate() - 1);
      }
    }

    const getWeekday = (date: Date) => ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    const formatDate = (d: Date) => `${d.getUTCMonth() + 1}/${d.getUTCDate()}（${getWeekday(d)}）`;
    const formatTime = (h: string) => h;

    setSelectedCellText(
      `${formatDate(zoneDate)} ${formatTime(selectedZoneTime)}（${label}） = ${formatDate(jstDate)} ${formatTime(jstTime)}（JST）`
    );
  };

  const handleCellClick = (label: string, hour: number, index: number) => {
    if (label === "JST") return;

    if (activeCell && activeCell.label === label && activeCell.index === index) {
      setActiveCell(null);
      setSelectedCellText('');
      return;
    }

    setActiveCell({ label, hour, index });
    updateText({ label, hour, index }, selectedDate);
  };

  const copyToClipboard = (e: React.MouseEvent<SVGSVGElement>) => { // 型を修正
    if (selectedCellText) {
      navigator.clipboard.writeText(selectedCellText)
        .then(() => {
          // マウス位置にツールチップを表示
          const tooltipX = e.clientX + 20; // マウスポインタの右側に表示
          const tooltipY = e.clientY - 20; // マウスポインタの上側に表示
          setTooltipPosition({ x: tooltipX, y: tooltipY });
          setTooltipVisible(true); // ツールチップを表示
          // Tooltip コンポーネント内で自動的に非表示になります
        })
        .catch(() => {
          alert('クリップボードへのコピーに失敗しました。');
        });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-base font-semibold text-gray-700 mb-1">Time Zone</h2>

      {/* タイムゾーンバーとカレンダーの配置 */}
      <div className="flex flex-row items-start mt-1 gap-4 overflow-hidden"> {/* mt-2 → mt-1, overflow-y-hidden を追加 */}
        {/* カレンダーとキャプション（左寄せ） */}
        <div className="mt-5 ml-5 mr-5"> {/* mt-2 → mt-1 */}
          <label htmlFor="date-picker" className="text-xs font-semibold block mb-1">基準日</label>
          <input
            id="date-picker"
            type="date"
            value={selectedDate.toISOString().slice(0, 10)}
            onChange={handleDateChange}
            className="border p-1 text-xs"
          />
        </div>

        {/* バー群 */}
        <div className="flex-1">
          {timezones.map((timezone, tzIndex) => (
            <TimeZoneBar
              key={tzIndex}
              label={timezone.label}
              offset={timezone.offset}
              selectedDate={selectedDate}
              activeHourIndex={activeCell?.label === timezone.label ? activeCell.index : null}
              jstActiveHourIndex={activeCell ? activeCell.index : null}
              onCellClick={(label: string, hour: number, idx: number) => handleCellClick(label, hour, idx)}
              isJST={timezone.label === "JST"}
            />
          ))}
        </div>
      </div>

      {/* セルクリック時の情報表示 */}
      <div className="mt-3 p-1 bg-white rounded border text-xs w-[400px] ml-[340px] flex justify-between items-center">
        <input
          type="text"
          value={selectedCellText}
          onChange={(e) => setSelectedCellText(e.target.value)}
          placeholder="Time Zoneのセルを選択してください。（基準となるJSTを除く）"
          className="bg-white w-full p-1 border-none focus:outline-none"
        />
        {/* コピーアイコン */}
        <ClipboardIcon 
          className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700 ml-2"
          onClick={copyToClipboard} // 修正済み
        />
      </div>

      {/* ツールチップ表示 */}
      {tooltipVisible && (
        <Tooltip
          message="コピーしました"
          position={tooltipPosition}
          visible={tooltipVisible}
          duration={1000}
          onClose={() => setTooltipVisible(false)}
        />
      )}
    </div>
  );
};

export default TimeZoneViewer;

