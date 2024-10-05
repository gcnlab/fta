// /app/sidebar.tsx

'use client';

import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/contents/tasks", label: "Tasks" },
    { href: "/contents/templates", label: "Templates" },
    { href: "/contents/mappings", label: "Mappings" },
    { href: "/contents/wizards", label: "Wizards" },
    { href: "/contents/tools", label: "Tools" },
    { href: "/contents/docs", label: "Docs" },
    { href: "/contents/links", label: "Links" },
  ];

  return (
    <aside className="w-24 bg-gray-200 text-black p-2 h-screen fixed top-8 shadow">
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`block text-xs font-semibold py-0.5 px-2 rounded-lg transition-all duration-300 transform hover:translate-x-1
              ${pathname === item.href 
                ? "bg-gradient-to-r from-indigo-800 to-blue-600 text-white font-bold border-l-4 border-indigo-500 shadow-md" 
                : "hover:bg-gray-300 hover:text-gray-900 text-black"
              }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

