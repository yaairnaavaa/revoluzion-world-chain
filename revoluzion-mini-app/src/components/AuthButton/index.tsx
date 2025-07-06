'use client';
import { walletAuth } from '@/auth/wallet';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit } from '@worldcoin/minikit-js';
import { useCallback, useEffect, useState } from 'react';

/**
 * This component is an example of how to authenticate a user
 * We will use Next Auth for this example, but you can use any auth provider
 * Read More: https://docs.world.org/mini-apps/commands/wallet-auth
 */
export const AuthButton = () => {
  const [isPending, setIsPending] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if MiniKit is installed
    const checkInstalled = () => {
      const installed = MiniKit.isInstalled();
      console.log('🔵 MiniKit installed status:', installed);
      setIsInstalled(installed);
    };
    
    checkInstalled();
    
    // Check periodically in case MiniKit loads later
    const interval = setInterval(checkInstalled, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const onClick = useCallback(async () => {
    console.log('🔵 AuthButton clicked - isInstalled:', isInstalled, 'isPending:', isPending);
    
    if (!isInstalled || isPending) {
      console.log('🔴 Cannot proceed - MiniKit not installed or already pending');
      return;
    }
    
    setIsPending(true);
    console.log('🟢 Starting wallet authentication...');
    
    try {
      await walletAuth();
      console.log('🟢 Wallet authentication successful');
    } catch (error) {
      console.error('🔴 Wallet authentication button error', error);
      setIsPending(false);
      return;
    }

    setIsPending(false);
  }, [isInstalled, isPending]);

  useEffect(() => {
    const authenticate = async () => {
      console.log('🔵 Auto-authentication check - isInstalled:', isInstalled, 'isPending:', isPending);
      
      if (isInstalled && !isPending) {
        console.log('🟢 Starting auto-authentication...');
        setIsPending(true);
        try {
          await walletAuth();
          console.log('🟢 Auto-authentication successful');
        } catch (error) {
          console.error('🔴 Auto wallet authentication error', error);
        } finally {
          setIsPending(false);
        }
      }
    };

    authenticate();
  }, [isInstalled, isPending]);

  return (
    <LiveFeedback
      label={{
        failed: 'Failed to login',
        pending: 'Logging in',
        success: 'Logged in',
      }}
      state={isPending ? 'pending' : undefined}
    >
      <Button
        onClick={onClick}
        disabled={isPending}
        size="lg"
        variant="primary"
      >
        Login with Wallet
      </Button>
    </LiveFeedback>
  );
};
