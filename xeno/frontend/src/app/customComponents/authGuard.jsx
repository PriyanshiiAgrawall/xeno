"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export const AuthGuard = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {

    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/status`, {
          method: 'GET',
          credentials: 'include', // Make sure cookies/session are sent
        });

        if (response.status === 200) {
          setIsAuthenticated(true);
          if(pathname==='/login'){
            router.push('/');
          }
        } else if (response.status === 401) {
          router.replace('/login');
        }
      } catch (err) {
        console.error("Auth check error:", err);
        router.replace('/login');
      } finally {
        setCheckingAuth(false);
      }
    };

 
   
      checkAuth();
    
  }, [pathname, router,isAuthenticated]);

  if (checkingAuth) {
    return <div>Loading...</div>; 
  }

  return children;
};
