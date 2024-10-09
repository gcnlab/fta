// /app/contents/home/IntraWebApps.tsx

'use client';

export default function IntraWebApps() {
  return (
    <div className="p-8 border border-gray-600 min-w-[500px] min-h-[250px] bg-transparent relative flex-shrink-0">
      <h2 className="text-lg font-semibold text-gray-100 mb-4 whitespace-nowrap">Intra Web Apps</h2>

      <div className="absolute top-0 right-0 p-8">
        <button className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-28 text-center whitespace-nowrap">
          <a href="https://gitlab.com" target="_blank" rel="noopener noreferrer">GitLab</a>
        </button>
      </div>

      {/* Products Sections */}
      <div className="items-center mb-2">
        <p className="text-gray-400 mb-2 text-xs text-end whitespace-nowrap">Shift+Click for Console</p>

        {/* GSE開発 */}
        <div className="flex items-center mb-2">
          <h3 className="text-end text-sm font-semibold text-gray-100 mr-2 w-20 whitespace-nowrap">GSE開発</h3>
          <div className="grid grid-cols-4 gap-2 w-full">
            {/* ボタン群 */}
            {['QAS1', 'DEV1', 'UAT', 'QAS2'].map((label, index) => (
              <button
                key={index}
                className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center whitespace-nowrap"
                onClick={(e) => {
                  const urls = [
                    ["http://10.219.7.77:7011/console/login/LoginForm.jsp", "http://10.219.7.77:7011/gseplan/servlet/MainServlet?FunctionCode_=LG0010001"],
                    ["http://10.219.7.77:7001/console/login/LoginForm.jsp", "http://10.219.7.77:7001/gseplan/servlet/MainServlet?FunctionCode_=LG0010001"],
                    ["http://10.219.7.77:7051/console/login/LoginForm.jsp", "http://10.219.7.77:7051/gseplan/servlet/MainServlet?FunctionCode_=LG0010001"],
                    ["http://10.219.7.77:7021/console/login/LoginForm.jsp", "http://10.219.7.77:7021/gseplan/servlet/MainServlet?FunctionCode_=LG0010001"],
                  ];
                  if (e.shiftKey) {
                    window.open(urls[index][0], "_blank");
                  } else {
                    window.open(urls[index][1], "_blank");
                  }
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* GIO開発 */}
        <div className="flex items-center mb-2">
          <h3 className="text-end text-sm font-semibold text-gray-100 mr-2 w-20 whitespace-nowrap">GIO開発</h3>
          <div className="grid grid-cols-4 gap-2 w-full">
            {/* ボタン群 */}
            {['GIOS_P', 'GIOS_D', 'GIOS_B', 'GIOS_F'].map((label, index) => (
              <button
                key={index}
                className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-1 rounded w-full text-center whitespace-nowrap"
                onClick={(e) => {
                  const shiftUrls = [
                    "http://10.219.7.50:7004/console/login/LoginForm.jsp",
                    "http://10.219.7.50:7003/console/login/LoginForm.jsp",
                    "http://10.219.7.50:7005/console/login/LoginForm.jsp",
                    "http://10.219.7.50:7001/console/login/LoginForm.jsp",
                  ];
                  const normalUrls = [
                    "http://10.219.7.50:7014/GIOS_P",
                    "http://10.219.7.50:7013/GIOS_D",
                    "http://10.219.7.50:7015/GIOS_B",
                    "http://10.219.7.50:7011/GIOS_F",
                  ];
                  if (e.shiftKey) {
                    window.open(shiftUrls[index], "_blank");
                  } else {
                    window.open(normalUrls[index], "_blank");
                  }
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-gray-700" style={{ width: '90%', margin: '8px auto' }} />

      {/* その他セクション */}
      <div className="items-center mb-4">
        {/* 申請 */}
        <div className="flex items-center mb-2">
          <h3 className="text-end text-sm font-semibold text-gray-100 mr-2 w-20 whitespace-nowrap">申請</h3>
          <div className="grid grid-cols-2 gap-2 w-full">
            {[
              { href: "https://t80451803j2f8br7.itpm.masterscope.jp/itpm/common/login/", label: "ITPM" },
              { href: "http://www.dwfs2.daikin.co.jp/dwfs/", label: "e-App" },
            ].map((item, index) => (
              <button key={index} className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-0.5 rounded w-full text-center whitespace-nowrap">
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              </button>
            ))}
          </div>
        </div>

        {/* Mail */}
        <div className="flex items-center mb-2">
          <h3 className="text-end text-sm font-semibold text-gray-100 mr-2 w-20 whitespace-nowrap">Mail</h3>
          <div className="grid grid-cols-2 gap-2 w-full">
            {[
              { href: "http://www.intra.daikin.co.jp/email/encrypt/", label: "暗号メール" },
              { href: "http://www.intra.daikin.co.jp/email/filesend/", label: "宅配メール" },
            ].map((item, index) => (
              <button key={index} className="bg-gray-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-600 text-white px-3 py-0.5 rounded w-full text-center whitespace-nowrap">
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
