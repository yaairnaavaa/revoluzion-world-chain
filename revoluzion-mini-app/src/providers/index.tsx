'use client';
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { worldchain } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const ErudaProvider = dynamic(
  () => import('@/providers/Eruda').then((c) => c.ErudaProvider),
  { ssr: false },
);

// Wagmi config
const config = createConfig({
  chains: [worldchain],
  transports: {
    [worldchain.id]: http(),
  },
});

const queryClient = new QueryClient();

// Define props for ClientProviders
interface ClientProvidersProps {
  children: ReactNode;
  session: Session | null; // Use the appropriate type for session from next-auth
}

/**
 * ClientProvider wraps the app with essential context providers.
 *
 * - ErudaProvider:
 *     - Should be used only in development.
 *     - Enables an in-browser console for logging and debugging.
 *
 * - MiniKitProvider:
 *     - Required for MiniKit functionality.
 *
 * This component ensures both providers are available to all child components.
 */
export default function ClientProviders({
  children,
  session,
}: ClientProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ErudaProvider>
          <MiniKitProvider>
            <SessionProvider session={session}>{children}</SessionProvider>
          </MiniKitProvider>
        </ErudaProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
