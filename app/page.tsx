// /app/page.tsx

'use client';

import MainContent from './contents/home/MainContent';
import ClockDisplay from './contents/home/ClockDisplay';
import FolderLinks from './contents/home/FolderLinks';
import AdditionalContents from './contents/home/AdditionalContents';

export default function Home() {
  return (
    <div className="grid sm:grid-cols-1 lg:grid-cols-2 grid-rows-2 lg:h-[calc(100vh-74px)] h-auto bg-gray-800 text-gray-200 text-sm relative gap-4 p-4 overflow-y-auto">
      <MainContent />
      <ClockDisplay />
      <FolderLinks />
      <AdditionalContents />
    </div>
  );
}
