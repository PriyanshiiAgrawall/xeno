'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './customComponents/sidebar';
import { AuthGuard } from './customComponents/authGuard';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const hideSidebar = pathname === '/login';

  return (
    <AuthGuard>
    <div className="flex min-h-screen">
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 p-6 bg-gray-50">
        {children}
      </main>
    </div>
   </AuthGuard>  
  );
}
