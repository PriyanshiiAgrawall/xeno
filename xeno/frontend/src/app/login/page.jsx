'use client';
import { FaGithub, FaGoogle } from 'react-icons/fa';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
export default function LoginPage() {
  const router = useRouter();
  const [emailId, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);



  const handleLocalLogin = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailId, password }),
      });

      console.log('Login response:', res);
      const data = await res.json();
      console.log('Login data:', data);

      if (res.ok) {
        router.push('/');
      } else {
        const { message } = data;
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const redirectTo = (provider) => {
    console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/${provider}`)
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/${provider}`;
  };

  const demoLogin = async () => {
    setIsSubmitting(true);
    setEmail("priyanshi@gmail.com");
    setPassword("12345678");
    await handleLocalLogin();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6 shadow-md">
        <CardContent className="space-y-6">
          {/* Welcome Heading and Description */}
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-richblack-900 lg:text-5xl mb-4">
              Welcome Back to ConnectCRM
            </h1>
            <p className="text-lg text-richblack-700 mb-6">
              Sign in to manage your customers, campaigns, and communication—all in one place.
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-2">
            <Input
              placeholder="Email"
              value={emailId}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className="w-full"
              onClick={handleLocalLogin}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login with Credentials'}
            </Button>
          </div>

          <hr className="my-4" />


          <Button
            className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
            onClick={() => redirectTo('google')}
          >
            <FaGoogle size={20} />
            Login with Google
          </Button>

          <Button
            className="w-full bg-black hover:bg-gray-900 text-white flex items-center justify-center gap-2"
            onClick={() => redirectTo('github')}
          >
            <FaGithub size={20} />
            Login with GitHub
          </Button>


          {/* Demo Login Button */}
          <Button
            disabled={isSubmitting}
            onClick={demoLogin}
            className="w-full bg-[#272E3F] hover:bg-[#1e2433] text-white rounded-lg py-3"
          >
            {isSubmitting ? 'Please Wait...' : 'Explore CRM with Demo Login'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
