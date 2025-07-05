'use client';

import { Page } from '@/components/PageLayout';
import { UserInfo } from '@/components/UserInfo';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { createPublicClient, http, formatUnits } from 'viem';
import { worldchain } from 'viem/chains';
import { erc20Abi } from 'viem';

// TODO: Replace with your deployed RVZ token address
const RVZ_TOKEN_ADDRESS = '0x...'; 
// Mainnet WLD token address on World Chain
// You can find this in the Worldcoin documentation or on a block explorer
const WLD_TOKEN_ADDRESS = '0x...'; // TODO: Find and add the WLD token address on World Chain

export default function Wallet() {
  const { data: session } = useSession();
  const address = session?.user?.walletAddress;
  const [rvzBalance, setRvzBalance] = useState<string>('0');
  const [wldBalance, setWldBalance] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) return;

      setLoading(true);

      const client = createPublicClient({
        chain: worldchain,
        transport: http(),
      });

      try {
        // Fetch RVZ Balance
        if (RVZ_TOKEN_ADDRESS !== '0x...') {
          const rvz = await client.readContract({
            address: RVZ_TOKEN_ADDRESS as `0x${string}`,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address as `0x${string}`],
          });
          setRvzBalance(formatUnits(rvz, 18));
        }

        // Fetch WLD Balance
        if (WLD_TOKEN_ADDRESS !== '0x...') {
          const wld = await client.readContract({
            address: WLD_TOKEN_ADDRESS as `0x${string}`,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address as `0x${string}`],
          });
          setWldBalance(formatUnits(wld, 18));
        }

      } catch (error) {
        console.error('Error fetching balances:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [address]);

  return (
    <Page>
      <UserInfo />
      <div className="flex flex-col items-center justify-center space-y-8">
        <h1 className="text-2xl font-bold">My Wallet</h1>
        
        <div className="w-full max-w-sm p-6 bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-white mb-4">Token Balances</h2>
          {loading ? (
            <div className="flex justify-center items-center">
              <p>Loading balances...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Revoluzion Token</span>
                <span className="font-mono text-lg">{parseFloat(rvzBalance).toFixed(4)} RVZ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Worldcoin</span>
                <span className="font-mono text-lg">{parseFloat(wldBalance).toFixed(4)} WLD</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
} 