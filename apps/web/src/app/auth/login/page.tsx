'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthInput } from '@/components/auth/AuthInput';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { authApi, AuthApiError } from '@/lib/api/auth';
import { authStorage } from '@/lib/auth/storage';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const tokens = await authApi.login({ email, password });
      authStorage.setTokens(tokens);
      router.push('/dashboard'); // Redirect to dashboard after login
    } catch (error) {
      if (error instanceof AuthApiError) {
        if (error.errors) {
          setErrors(error.errors as { email?: string; password?: string });
        } else {
          setErrors({ general: error.message });
        }
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsGoogleLoading(true);
      setErrors({});

      // Dynamically import to avoid SSR issues
      const { initiateGoogleRedirect } = await import('@/lib/auth/google');

      initiateGoogleRedirect();

    } catch (error) {
      setErrors({ general: 'Failed to initialize Google authentication.' });
      setIsGoogleLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-xl dark:shadow-2xl transition-all duration-300">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Log in to your studio
          </h1>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
              autoComplete="email"
            />

            <AuthInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              showPasswordToggle
              required
              autoComplete="current-password"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full 
                px-4 py-3 
                bg-gradient-to-r from-lime-500 to-lime-600
                hover:from-lime-600 hover:to-lime-700
                text-black 
                font-semibold 
                rounded-lg 
                transition-all
                disabled:opacity-50 
                disabled:cursor-not-allowed
                focus:outline-none 
                focus:ring-2 
                focus:ring-lime-500 
                focus:ring-offset-2 
                focus:ring-offset-gray-900
              "
            >
              {isLoading ? 'Logging in...' : 'Continue'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
          </div>

          <GoogleButton onClick={handleGoogleAuth} isLoading={isGoogleLoading} />

          <div className="mt-8 flex items-center justify-between text-sm">
            <Link
              href="/auth/signup"
              className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors font-medium"
            >
              Sign up
            </Link>
            <Link
              href="/auth/reset-password"
              className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors font-medium"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
