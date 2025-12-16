'use client';

import { useEffect, useCallback } from 'react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleIdConfiguration) => void;
          prompt: (momentListener?: (notification: PromptMomentNotification) => void) => void;
          renderButton: (
            parent: HTMLElement,
            options: GsiButtonConfiguration
          ) => void;
          disableAutoSelect: () => void;
          revoke: (email: string, callback: () => void) => void;
        };
      };
    };
  }
}

interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: CredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  context?: 'signin' | 'signup' | 'use';
}

interface CredentialResponse {
  credential: string;
  select_by?: string;
  clientId?: string;
}

interface GsiButtonConfiguration {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: number;
  locale?: string;
}

interface PromptMomentNotification {
  isDisplayMoment: () => boolean;
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () => string;
  isSkippedMoment: () => boolean;
  getSkippedReason: () => string;
  isDismissedMoment: () => boolean;
  getDismissedReason: () => string;
  getMomentType: () => string;
}

interface UseGoogleAuthOptions {
  onSuccess: (credential: string) => void;
  onError?: (error: Error) => void;
  clientId?: string;
  autoSelect?: boolean;
}

/**
 * Hook to handle Google OAuth authentication
 */
export function useGoogleAuth({
  onSuccess,
  onError,
  clientId,
  autoSelect = false,
}: UseGoogleAuthOptions) {
  const googleClientId = clientId || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    console.log('[GoogleAuth] Hook mounted. ClientID:', googleClientId, 'Window.google:', !!window.google);
    
    // Check if script is already there
    const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (existingScript && window.google) {
        console.log('[GoogleAuth] Script already loaded, initializing...');
        if (window.google && googleClientId) {
            console.log('[GoogleAuth] Re-initializing with:', {
              clientId: googleClientId?.substring(0, 10) + '...',
              origin: window.location.origin
            });
            window.google.accounts.id.initialize({
              client_id: googleClientId,
              callback: (response: CredentialResponse) => {
                console.log('[GoogleAuth] Response received');
                try {
                  onSuccess(response.credential);
                } catch (error) {
                  onError?.(error as Error);
                }
              },
              auto_select: autoSelect,
            });
        }
        return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google && googleClientId) {
        console.log('[GoogleAuth] Initializing with:', {
          clientId: googleClientId?.substring(0, 10) + '...',
          origin: window.location.origin,
          host: window.location.host,
          timestamp: new Date().toISOString()
        });
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response: CredentialResponse) => {
            console.log('[GoogleAuth] Response received');
            try {
              onSuccess(response.credential);
            } catch (error) {
              onError?.(error as Error);
            }
          },
          auto_select: autoSelect,
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [googleClientId, onSuccess, onError, autoSelect]);

  const renderButton = useCallback(
    (element: HTMLElement, options?: GsiButtonConfiguration) => {
      if (window.google && googleClientId) {
        window.google.accounts.id.renderButton(element, {
          type: 'standard',
          theme: 'filled_black',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          ...options,
        });
      }
    },
    [googleClientId]
  );

  const promptOneTap = useCallback(() => {
    if (window.google && googleClientId) {
      window.google.accounts.id.prompt();
    }
  }, [googleClientId]);

  return {
    renderButton,
    promptOneTap,
    isReady: !!window.google && !!googleClientId,
  };
}

/**
 * Manually trigger Google Sign-In popup
 */
export function triggerGoogleSignIn(
  onSuccess: (credential: string) => void,
  onError?: (error: Error) => void
) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    onError?.(new Error('Google Client ID is not configured'));
    return;
  }

  // Load the script if not already loaded
  if (!window.google) {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      initializeAndPrompt();
    };
    
    document.body.appendChild(script);
  } else {
    initializeAndPrompt();
  }

  function initializeAndPrompt() {
    if (window.google && clientId) {
      console.log('[GoogleAuth-Trigger] Initializing with:', {
        clientId: clientId?.substring(0, 10) + '...',
        origin: window.location.origin,
        href: window.location.href,
        referrer: document.referrer
      });
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: CredentialResponse) => {
          try {
            onSuccess(response.credential);
          } catch (error) {
            onError?.(error as Error);
          }
        },
      });


      // timeout to handle cases where the prompt fails silently
      const timeoutId = setTimeout(() => {
        onError?.(new Error('Google Sign-In timed out.'));
      }, 5000); // 5 second timeout

      window.google.accounts.id.prompt((notification: PromptMomentNotification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment() || notification.isDismissedMoment()) {
            clearTimeout(timeoutId);
            const reason = notification.getNotDisplayedReason() || notification.getSkippedReason() || notification.getDismissedReason();
            console.error('[GoogleAuth] Prompt failed/skipped:', reason);
            
            // Map common failure reasons to user-friendly messages
            let errorMessage = `Google Sign-In failed (${reason})`;
            if (reason === 'opt_out_or_no_session') {
                errorMessage = 'No Google session found or you opted out.';
            } else if (reason === 'suppressed_by_user') {
                errorMessage = 'Sign-in popup was closed.';
            }
            
            if (notification.isNotDisplayed()) {
                 onError?.(new Error(errorMessage));
            }
        } else if (notification.isDisplayed()) {
            clearTimeout(timeoutId);
            console.log('[GoogleAuth] Prompt displayed successfully');
        }
      });
    }
  }
}

/**
 * Initiates the Google OAuth 2.0 flow via full page redirect
 * This is the "Bulletproof" method that avoids Origin issues
 */
export function initiateGoogleRedirect() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '';
  
  if (!clientId) {
      console.error('Google Client ID not found');
      return;
  }

  const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'email profile openid',
      access_type: 'offline',
      prompt: 'consent'
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  console.log('[GoogleRedirect] Navigating to:', url);
  window.location.href = url;
}
