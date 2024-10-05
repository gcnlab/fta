// /app/page.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // クライアントサイドでのみ時間を設定
    setCurrentTime(new Date());
    const intervalId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(intervalId); // クリーンアップ
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

  const copyToClipboard = (text: string, event: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(text).then(() => {
      // マウス位置にツールチップを表示
      const tooltipX = event.clientX + 20; // マウスポインタのさらに右上に表示
      const tooltipY = event.clientY - 20;
      setTooltipPosition({ x: tooltipX, y: tooltipY });
      setTooltipVisible(true); // ツールチップを表示
      setTimeout(() => setTooltipVisible(false), 1000); // 1秒後に非表示
    });
  };

  return (
    <div className="grid sm:grid-cols-1 lg:grid-cols-2 grid-rows-2 lg:h-[calc(100vh-74px)] h-auto bg-gray-800 text-gray-200 text-sm relative">

      {/* 左上: メインコンテンツ */}
      <div className="p-8 border border-gray-600 relative min-h-[200px]">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Intra Web Apps</h2>

        <div className="absolute top-0 right-0 p-8">
          <button className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-28 text-center">
            <a href="https://gitlab.com" target="_blank">GitLab</a>
          </button>
        </div>
        {/* products */}
        <div className="item-center mb-2">
          <p className="text-gray-400 mb-2 text-xs text-end">Shift+Click for Console</p>

          {/* GSE開発 */}
          <div className="flex items-center mb-2">
            <h3 className="text-end text-sm font-semibold text-gray-100 mr-2 w-20">GSE開発</h3>
            <div className="grid grid-cols-4 gap-2 w-full">
              <button
                className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center"
                onClick={(e) => {
                  if (e.shiftKey) {
                    window.open("http://10.219.7.77:7011/console/login/LoginForm.jsp", "_blank"); // シフトキーが押された場合のURL
                  } else {
                    window.open("http://10.219.7.77:7011/gseplan/servlet/MainServlet?FunctionCode_=LG0010001", "_blank"); // 通常のURL
                  }
                }}
              >
                QAS1
              </button>
              <button
                className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center"
                onClick={(e) => {
                  if (e.shiftKey) {
                    window.open("http://10.219.7.77:7001/console/login/LoginForm.jsp", "_blank"); // シフトキーが押された場合のURL
                  } else {
                    window.open("http://10.219.7.77:7001/gseplan/servlet/MainServlet?FunctionCode_=LG0010001", "_blank"); // 通常のURL
                  }
                }}
              >
                DEV1
              </button>
              <button
                className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center"
                onClick={(e) => {
                  if (e.shiftKey) {
                    window.open("http://10.219.7.77:7051/console/login/LoginForm.jsp", "_blank"); // シフトキーが押された場合のURL
                  } else {
                    window.open("http://10.219.7.77:7051/gseplan/servlet/MainServlet?FunctionCode_=LG0010001", "_blank"); // 通常のURL
                  }
                }}
              >
                UAT
              </button>
              <button
                className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center"
                onClick={(e) => {
                  if (e.shiftKey) {
                    window.open("http://10.219.7.77:7021/console/login/LoginForm.jsp", "_blank"); // シフトキーが押された場合のURL
                  } else {
                    window.open("http://10.219.7.77:7021/gseplan/servlet/MainServlet?FunctionCode_=LG0010001", "_blank"); // 通常のURL
                  }
                }}
              >
                QAS2
              </button>
            </div>
          </div>

          {/* GIO開発 */}
          <div className="flex items-center mb-2">
            <h3 className="text-end text-sm font-semibold text-gray-100 mr-2 w-20">GIO開発</h3>
            <div className="grid grid-cols-4 gap-2 w-full">
              <button
                className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center"
                onClick={(e) => {
                  if (e.shiftKey) {
                    window.open("http://10.219.7.50:7004/console/login/LoginForm.jsp", "_blank"); // シフトキーが押された場合のURL
                  } else {
                    window.open("http://10.219.7.50:7014/GIOS_P", "_blank"); // 通常のURL
                  }
                }}
              >
                GIOS_P
              </button>
              <button
                className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center"
                onClick={(e) => {
                  if (e.shiftKey) {
                    window.open("http://10.219.7.50:7003/console/login/LoginForm.jsp", "_blank"); // シフトキーが押された場合のURL
                  } else {
                    window.open("http://10.219.7.50:7013/GIOS_D", "_blank"); // 通常のURL
                  }
                }}
              >
                GIOS_D
              </button>
              <button
                className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center"
                onClick={(e) => {
                  if (e.shiftKey) {
                    window.open("http://10.219.7.50:7005/console/login/LoginForm.jsp", "_blank"); // シフトキーが押された場合のURL
                  } else {
                    window.open("http://10.219.7.50:7015/GIOS_B", "_blank"); // 通常のURL
                  }
                }}
              >
                GIOS_B
              </button>
              <button
                className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center"
                onClick={(e) => {
                  if (e.shiftKey) {
                    window.open("http://10.219.7.50:7001/console/login/LoginForm.jsp", "_blank"); // シフトキーが押された場合のURL
                  } else {
                    window.open("http://10.219.7.50:7011/GIOS_F", "_blank"); // 通常のURL
                  }
                }}
              >
                GIOS_F
              </button>
            </div>
          </div>
        </div>

        <hr className="border-gray-700" style={{ width: '90%', margin: '8px auto' }} />

        {/* イントラその他 */}
        <div className="item-center mb-4">
        <div className="flex items-center mb-2">
            <h3 className="text-end text-sm font-semibold text-gray-100 mr-2 w-20">申請</h3>
            <div className="grid grid-cols-2 gap-2 w-full">
              <button className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-0.5 rounded w-full text-center">
                <a href="https://t80451803j2f8br7.itpm.masterscope.jp/itpm/common/login/" target="_blank">
                  ITPM
                </a>
              </button>
              <button className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-0.5 rounded w-full text-center">
                <a href="http://www.dwfs2.daikin.co.jp/dwfs/" target="_blank">
                  e-App
                </a>
              </button>

            </div>
          </div>
          <div className="flex items-center mb-2">
            <h3 className="text-end text-sm font-semibold text-gray-100 mr-2 w-20">Mail</h3>
            <div className="grid grid-cols-2 gap-2 w-full">
              <button className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-0.5 rounded w-full text-center">
                <a href="http://www.intra.daikin.co.jp/email/encrypt/" target="_blank">
                  暗号メール
                </a>
              </button>
              <button className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-0.5 rounded w-full text-center">
                <a href="http://www.intra.daikin.co.jp/email/filesend/" target="_blank">
                  宅配メール
                </a>
              </button>

            </div>
          </div>
        </div>

      </div>

      {/* 右上: 時計表示 */}
      <div className="p-8 border border-gray-600 text-right min-h-[200px]">
        <h2 className="text-lg font-semibold text-gray-100">Current Date and Time</h2>
        <p className="text-base text-gray-400">{formatDate(currentTime!)}</p>
        <p className="text-lg text-gray-200">{currentTime?.toLocaleTimeString()}</p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <h3 className="text-base font-semibold text-gray-300">China Time</h3>
            <p className="text-gray-200">{formatTime(currentTime!, 'Asia/Shanghai')}</p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-300">Thailand Time</h3>
            <p className="text-gray-200">{formatTime(currentTime!, 'Asia/Bangkok')}</p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-300">Germany Time</h3>
            <p className="text-gray-200">{formatTime(currentTime!, 'Europe/Berlin')}</p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-300">New York Time</h3>
            <p className="text-gray-200">{formatTime(currentTime!, 'America/New_York')}</p>
          </div>
        </div>
      </div>

      {/* 左下: リンクパス表示とコピー */}
      <div className="p-8 border border-gray-600 relative min-h-[200px]">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Folder Links</h2>
        <p className="text-gray-400 mb-2 text-xs text-end">Copy Path to Clipboard</p>

        {/* ツールチップ */}
        {tooltipVisible && (
          <div
            className="fixed bg-pink-200 text-slate-500 px-3 py-1 rounded-lg opacity-90 z-50 text-xs"
            style={{ top: `${tooltipPosition.y}px`, left: `${tooltipPosition.x}px`, transition: 'opacity 0.5s ease' }}
          >
            Copied to clipboard!
          </div>
        )}

        {/* メインリンク */}
        <div className="flex items-center mb-0">
          <div className="grid grid-cols-1 gap-2 w-full">
            <button
              onClick={(e) =>
                copyToClipboard(
                  'G:\\共有ドライブ\\DKI_zA-3_開発１部_化学_共有_SPIS\\03_SPIS\\20_フォロー業務　問合・依頼対応一覧\\問い合せ・仕様変更・不具合対応（周辺システム）',
                  e
                )
              }
              className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-0.5 rounded mb-2 w-full text-left"
            >
              問い合せ・仕様変更・不具合対応（周辺システム）
            </button>
          </div>
        </div>
        <div className="flex items-center mb-2">
          <div className="grid grid-cols-3 gap-2 w-full">
            <button
              onClick={(e) => copyToClipboard('G:\\共有ドライブ\\DKI_A-3_開発１部_化学_共有\\01_化学Gr_LVL3\\運用B01　運用業務\\U010　定例運用', e)}
              className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-0.5 rounded w-full text-center"
            >
              定例運用
            </button>
            <button
              onClick={(e) => copyToClipboard('G:\\共有ドライブ\\DKI_A-3_開発１部_化学_共有\\01_化学Gr_LVL3\\管理\\50　化学Grミーティング\\業務報告（アイスター）', e)}
              className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-0.5 rounded w-full text-center"
            >
              業務報告（WBS）
            </button>
            <button
              onClick={(e) => copyToClipboard('G:\\共有ドライブ\\DKI_A-3_開発１部_化学_共有\\01_化学Gr_LVL3\\管理\\99　★作業実績', e)}
              className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-0.5 rounded w-full text-center"
            >
              作業実績
            </button>
          </div>
        </div>

        {/* 見出しとその右にボタンを表示 */}
        <div className="flex items-center mb-2">
          <h3 className="text-end text-sm font-semibold text-gray-100 mr-2 w-20">GSE開発</h3>
          <div className="grid grid-cols-4 gap-2 w-full">
            <button
              onClick={(e) => copyToClipboard('\\\\10.219.7.76\\d$', e)}
              className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center"
            >
              DB-d
            </button>
            <button
              onClick={(e) => copyToClipboard('\\\\10.219.7.76\\e$', e)}
              className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center"
            >
              DB-e
            </button>
            <button
              onClick={(e) => copyToClipboard('\\\\10.219.7.77\\d$', e)}
              className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center"
            >
              AP-d
            </button>
            <button
              onClick={(e) => copyToClipboard('\\\\10.219.7.77\\e$', e)}
              className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center"
            >
              AP-e
            </button>
          </div>
        </div>

        <div className="flex items-center mb-2">
          <h3 className="text-end text-sm font-semibold text-gray-100 mr-2 w-20">GIO開発</h3>
          <div className="grid grid-cols-4 gap-2 w-full">
            <button
              onClick={(e) => copyToClipboard('\\\\10.219.7.49\\d$', e)}
              className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center"
            >
              DB-d
            </button>
            <button
              onClick={(e) => copyToClipboard('\\\\10.219.7.49\\e$', e)}
              className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center"
            >
              DB-e
            </button>
            <button
              onClick={(e) => copyToClipboard('\\\\10.219.7.50\\d$', e)}
              className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center"
            >
              AP-d
            </button>
            <button
              onClick={(e) => copyToClipboard('\\\\10.219.7.50\\e$', e)}
              className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center"
            >
              AP-e
            </button>
          </div>
        </div>
      </div>

      {/* 右下: 空白（将来のコンテンツ用） */}
      <div className="p-8 border border-gray-600 min-h-[200px]">
        <h2 className="text-lg font-semibold text-gray-100">Additional Contents</h2>

        <br></br>
        <h3 className="text-sm ml-4 font-semibold text-gray-300 mb-8">ローカル開発環境インストーラ</h3> {/* Changed mb-4 to mb-8 for more space */}
        {/* GS-EPLAN section */}
        <div className="grid grid-cols-4 gap-1 w-full ml-12">
          <h3 className="text-sm font-semibold text-gray-100 mr-2 w-15">GS-EPLAN</h3>
          <Link href="/installer/GS-EPLANローカル開発環境.zip" className="text-teal-200 hover:text-teal-300  hover:translate-x-0.5 hover:translate-y-0.5 inline-block">
            [インストーラ]
          </Link>
          <Link href="/installer/GS-EPLANローカル開発環境構築手順書.xlsx" className="text-teal-200 hover:text-teal-300  hover:translate-x-0.5 hover:translate-y-0.5 inline-block">
            [手順書]
          </Link>
          {/* 見えない隠し列を追加 */}
          <span className="w-2"></span>
        </div>

        {/* GIOS section */}
        <div className="grid grid-cols-4 gap-1 w-full ml-12 mt-2">
          <h3 className="text-sm font-semibold text-gray-100 mr-2 w-15">GIOS</h3>
          <Link href="/installer/GIOSローカル開発環境.zip" className="text-teal-200 hover:text-teal-300 hover:translate-x-0.5 hover:translate-y-0.5 inline-block">
            [インストーラ]
          </Link>
          <Link href="/installer/GIOSローカル開発環境構築手順書.xlsx" className="text-teal-200 hover:text-teal-300 hover:translate-x-0.5 hover:translate-y-0.5 inline-block">
            [手順書]
          </Link>
          {/* 見えない隠し列を追加 */}
          <span className="w-2"></span>
        </div>
      </div>

    </div>
  );
}
