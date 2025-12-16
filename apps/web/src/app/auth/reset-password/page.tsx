'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { AuthInput } from '@/components/auth/AuthInput';
import { authApi, AuthApiError } from '@/lib/api/auth';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setStatusMessage('');
    setIsLoading(true);

    try {
      const response = await authApi.requestPasswordReset({ email });
      setStatusMessage(response.message);
      setIsSuccess(true);
    } catch (err) {
      if (err instanceof AuthApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-xl dark:shadow-2xl transition-all duration-300">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            Reset your password
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Enter your email address and we'll send you a reset link
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isSuccess}
            />

            <button
              type="submit"
              disabled={isLoading || isSuccess}
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
              {isLoading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>

          {/* Status message area */}
          {statusMessage && (
            <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <div className="flex items-start gap-3">
                {isSuccess ? (
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <p className="text-gray-300 text-sm">{statusMessage}</p>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/auth/login"
              className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors font-medium text-sm"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
