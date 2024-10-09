// /app/components/AdditionalContents.tsx

'use client';

import Link from 'next/link';

export default function AdditionalContents() {
  return (
    <div className="p-8 border border-gray-600 min-w-[500px] min-h-[250px] bg-transparent">
      <h2 className="text-lg font-semibold text-gray-100 whitespace-nowrap">Additional Contents</h2>

      <br />
      <h3 className="text-sm ml-4 font-semibold text-gray-300 mb-8 whitespace-nowrap">ローカル開発環境インストーラ</h3>

      {/* GS-EPLAN セクション */}
      <div className="grid grid-cols-4 gap-1 w-full ml-12">
        <h3 className="text-sm font-semibold text-gray-100 mr-2 w-15 whitespace-nowrap">GS-EPLAN</h3>
        <Link href="/installer/GS-EPLANローカル開発環境.zip" className="text-teal-200 hover:text-teal-300 hover:translate-x-0.5 hover:translate-y-0.5 inline-block whitespace-nowrap">
          [インストーラ]
        </Link>
        <Link href="/installer/GS-EPLANローカル開発環境構築手順書.xlsx" className="text-teal-200 hover:text-teal-300 hover:translate-x-0.5 hover:translate-y-0.5 inline-block whitespace-nowrap">
          [手順書]
        </Link>
        {/* 見えない隠し列を追加 */}
        <span className="w-2"></span>
      </div>

      {/* GIOS セクション */}
      <div className="grid grid-cols-4 gap-1 w-full ml-12 mt-2">
        <h3 className="text-sm font-semibold text-gray-100 mr-2 w-15 whitespace-nowrap">GIOS</h3>
        <Link href="/installer/GIOSローカル開発環境.zip" className="text-teal-200 hover:text-teal-300 hover:translate-x-0.5 hover:translate-y-0.5 inline-block whitespace-nowrap">
          [インストーラ]
        </Link>
        <Link href="/installer/GIOSローカル開発環境構築手順書.xlsx" className="text-teal-200 hover:text-teal-300 hover:translate-x-0.5 hover:translate-y-0.5 inline-block whitespace-nowrap">
          [手順書]
        </Link>
        {/* 見えない隠し列を追加 */}
        <span className="w-2"></span>
      </div>
    </div>
  );
}
