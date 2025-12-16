'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { authStorage } from '@/lib/auth/storage';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const idToken = searchParams.get('id_token') || searchParams.get('credential');
    
    if (code) {
        handleAuth({ code });
    } else if (idToken) {
        handleAuth({ id_token: idToken });
    } else {
         // Check hash for id_token (if implicit fallback)
         // Note: Accessing window.location in useEffect is safe
         if (typeof window !== 'undefined') {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const hashToken = hashParams.get('id_token') || hashParams.get('credential');
            
            if (hashToken) {
                handleAuth({ id_token: hashToken });
                return;
            }
         }
         
         // Only set error if we really found nothing and params are loaded
         // (searchParams is usually ready immediately in client component)
         if (!code && !idToken) {
            setError('No authorization code found');
         }
    }

    async function handleAuth(data: { code?: string, id_token?: string }) {
        try {
            const tokens = await authApi.googleAuth(data);
            authStorage.setTokens(tokens);
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Auth error:', err);
            setError(err.message || 'Authentication failed');
            setTimeout(() => router.push('/auth/login'), 3000);
        }
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-black">
        {error ? (
            <div className="p-4 text-red-500 bg-red-100 rounded-lg">
                <h3 className="font-bold">Authentication Failed</h3>
                <p>{error}</p>
                <p className="text-sm mt-2">Redirecting to login...</p>
            </div>
        ) : (
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
                <p className="text-gray-500">Completing sign in...</p>
            </div>
        )}
    </div>
  );
}
