// /app/layout.tsx

import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Sidebar from './sidebar'; // 新しい Sidebar コンポーネントをインポート
import "./globals.css";

const noto_sans_jp = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "follow team app",
  description: "A follow team web app with a full-width header and sidebar under it",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full">
      <body className={`${noto_sans_jp.className} h-full`}>
        {/* ヘッダーバー */}
        <header className="bg-blue-950 text-white p-1 w-full fixed top-0 z-50">
          <div className="flex justify-between items-center">
            <h1 className="text-sm font-bold">(^^)/</h1>
            <div>
              <a href="/profile" className="text-xs hover:text-gray-300">
                under construction...
              </a>
            </div>
          </div>
        </header>

        {/* コンテンツ全体 */}
        <div className="pt-8 flex h-full">
          {/* サイドメニュー */}
          <Sidebar /> {/* クライアントコンポーネントとしてサイドバーを使用 */}

          {/* メインコンテンツ */}
          <main className="ml-24 pt-4 p-4 w-full bg-gray-100 overflow-y-auto h-[calc(100vh-2rem)]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

