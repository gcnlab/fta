// /app/components/ClockDisplay.tsx

'use client';

import { useEffect, useState } from 'react';

export default function ClockDisplay() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const intervalId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (date: Date, timeZone: string) => {
    return date?.toLocaleTimeString('ja-JP', { timeZone });
  };

  const formatDate = (date: Date) => {
    return date?.toLocaleDateString('ja-JP', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="p-8 pt-4 pb-4 border border-gray-600 bg-transparent text-right">
      <h2 className="text-lg font-semibold text-gray-100 whitespace-nowrap">Current Date and Time</h2>
      <p className="text-base text-gray-400 whitespace-nowrap">{formatDate(currentTime!)}</p>
      <p className="text-lg text-gray-200 whitespace-nowrap">{currentTime?.toLocaleTimeString()}</p>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div>
          <h3 className="text-base font-semibold text-gray-300 whitespace-nowrap">China Time</h3>
          <p className="text-gray-200 whitespace-nowrap">{formatTime(currentTime!, 'Asia/Shanghai')}</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-300 whitespace-nowrap">Thailand Time</h3>
          <p className="text-gray-200 whitespace-nowrap">{formatTime(currentTime!, 'Asia/Bangkok')}</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-300 whitespace-nowrap">Germany Time</h3>
          <p className="text-gray-200 whitespace-nowrap">{formatTime(currentTime!, 'Etc/GMT-1')}</p>
          <p className="text-gray-200 text-xs text-end whitespace-nowrap">*utc+1 fixed</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-300 whitespace-nowrap">New York Time</h3>
          <p className="text-gray-200 whitespace-nowrap">{formatTime(currentTime!, 'America/New_York')}</p>
          <p className="text-gray-200 text-xs text-end whitespace-nowrap">*auto summer time</p>
        </div>
      </div>
    </div>
  );
}

