// /app/page.tsx

'use client';

import MainContent from './contents/home/IntraWebApps';
import ClockDisplay from './contents/home/ClockDisplay';
import FolderLinks from './contents/home/FolderLinks';
import AdditionalContents from './contents/home/AdditionalContents';

export default function Home() {
  return (
    <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-y-auto bg-gray-800 text-gray-200 text-sm">
      <MainContent />
      <ClockDisplay />
      <FolderLinks />
      <AdditionalContents />
    </div>
  );
}
