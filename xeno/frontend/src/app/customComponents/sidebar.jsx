'use client';

import { useRouter } from 'next/navigation';
import {
  Home,
  Users,
  Sliders,
  Megaphone,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'Customers', icon: Users, href: '/customer' },
  { name: 'Create Segments', icon: Sliders, href: '/segment' },
  { name: 'Campaigns', icon: Megaphone, href: '/campaign' },
  
];

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = async function() {
   const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/logout`,{
          method: 'GET',
          credentials: 'include', 
        });
   router.push('/login');
  };

  return (
    <aside className="w-64 h-screen bg-white border-r px-4 py-6 shadow-sm">
      <div className="text-2xl font-bold mb-8 px-2">ConnectCRM</div>

      <nav className="flex flex-col gap-2">
        {navItems.map(({ name, icon: Icon, href }) => (
          <Button
            key={name}
            variant="ghost"
            className="justify-start w-full gap-2 text-left"
            onClick={() => router.push(href)}
          >
            <Icon className="w-5 h-5" />
            {name}
          </Button>
        ))}
      </nav>

      <div className="bottom-6 left-8 right-4 mt-[15px] flex ">
        <Button
        
          className=" justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
   
      
    </aside>
  );
}
