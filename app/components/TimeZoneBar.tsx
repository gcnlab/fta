// /app/components/TimeZoneBar.tsx

import React from 'react';

interface TimeZoneBarProps {
    label: string;
    offset: number;
    selectedDate: Date;
    onCellClick: (label: string, hour: number, index: number) => void;
    isJST?: boolean;
    activeHourIndex: number | null;
    jstActiveHourIndex: number | null; // JST のアクティブセル
}

const TimeZoneBar: React.FC<TimeZoneBarProps> = ({
    label,
    offset,
    selectedDate,
    onCellClick,
    isJST,
    activeHourIndex,
    jstActiveHourIndex,
}) => {
    // 各ゾーンの時刻を生成
    const hours = Array.from({ length: 24 }, (_, index) => (index + offset + 24) % 24);
    const offsetString = offset >= 0 ? `+${offset}` : `${offset}`;

    // カレンダーの日付とセルの日付が一致するかを判定
    const getBorderClass = (index: number) => {
        const utcDate = new Date(selectedDate);
        utcDate.setUTCHours(index);

        // 各タイムゾーンの日付をオフセットで計算
        const zoneDate = new Date(utcDate);
        zoneDate.setUTCHours(zoneDate.getUTCHours() + offset);

        // UTC の日付と各ゾーンの日付が一致するか
        const isSameDay = zoneDate.getUTCDate() === selectedDate.getUTCDate();

        return isSameDay
            ? 'border-b-2 border-green-500'
            : 'border border-gray-200';
    };

    return (
        <div className="flex items-center text-xs mb-2">
            {/* タイムゾーンラベル */}
            <div
                className="text-sm text-right pr-2 whitespace-nowrap font-mono"
                style={{ width: '30px' }} // 固定幅を設定
            >
                {label}
            </div>

            {/* オフセットラベル */}
            <div
                className="mx-2 text-gray-500 text-xs font-mono"
                style={{ width: '20px' }} // 固定幅を設定
            >
                {offsetString}
            </div>

            {/* 時刻セル */}
            <div className="flex">
                {hours.map((hour, index) => {
                    // JST のアクティブセルかどうかを判定
                    const isJstActive = isJST && index === jstActiveHourIndex;
                    // その他のアクティブセルかどうかを判定
                    const isActive = !isJstActive && index === activeHourIndex;

                    // 枠線のクラスを条件に基づいて設定
                    let borderClass = 'border border-gray-200'; // デフォルト
                    if (isJstActive) {
                        borderClass = 'border-2 border-red-800'; // JST のアクティブセルは赤枠
                    } else if (isActive) {
                        borderClass = 'border-2 border-indigo-800'; // その他のアクティブセルはインディゴ枠
                    }

                    // 背景色の条件
                    const bgColor = hour >= 9 && hour <= 17 ? 'bg-yellow-100' : '';

                    // フォントの太さの条件
                    const fontWeight = isJST ? 'font-bold' : '';

                    return (
                        <div
                            key={index}
                            onClick={() => onCellClick(label, hour, index)}
                            className={`h-5 flex items-center justify-center text-center cursor-pointer ${bgColor} ${borderClass} ${fontWeight} ${getBorderClass(index)}`}
                            style={{ width: '25px' }} // 固定幅を指定
                        >
                            {hour}
                        </div>
                    );
                })}
            </div>
        </div>

    );
};

export default TimeZoneBar;

