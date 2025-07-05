'use client';

import { Page } from '@/components/PageLayout';
import { UserInfo } from '@/components/UserInfo';
import { RVZ_TOKEN_ADDRESS, WLD_TOKEN_ADDRESS } from '@/lib/contracts';
import { useAccount, useBalance } from 'wagmi';

export default function Wallet() {
  const { address } = useAccount();

  const { data: rvzBalanceData, isLoading: isRvzBalanceLoading } = useBalance({
    address,
    token: RVZ_TOKEN_ADDRESS,
  });

  const { data: wldBalanceData, isLoading: isWldBalanceLoading } = useBalance({
    address,
    token: WLD_TOKEN_ADDRESS,
  });

  const rvzBalanceDisplay = isRvzBalanceLoading
    ? 'Loading...'
    : rvzBalanceData
    ? parseFloat(rvzBalanceData.formatted).toFixed(4)
    : '0.0000';

  const wldBalanceDisplay = isWldBalanceLoading
    ? 'Loading...'
    : wldBalanceData
    ? parseFloat(wldBalanceData.formatted).toFixed(4)
    : '0.0000';

  // Mock data for transactions - will be replaced in the future
  const mockTransactions = [
    { id: 1, type: 'in', token: 'RVZ', amount: '+ 500', date: '2023-10-26' },
    { id: 2, type: 'out', token: 'WLD', amount: '- 2.5', date: '2023-10-25' },
    { id: 3, type: 'in', token: 'RVZ', amount: '+ 100', date: '2023-10-24' },
  ];

  const totalValueDisplay =
    isRvzBalanceLoading || !rvzBalanceData || isWldBalanceLoading || !wldBalanceData
      ? '...'
      : `$${(
          parseFloat(rvzBalanceData.formatted) * 0.15 + // Mock price for RVZ
          parseFloat(wldBalanceData.formatted) * 2.5 // Mock price for WLD
        ).toFixed(2)}`;

  return (
    <Page>
       <Page.Header className="p-0 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Revoluzion" 
              className="h-8 w-8 rounded-full"
              style={{ objectFit: 'cover' }}
            />
            <span className="text-xl font-bold text-black">Revoluzion</span>
          </div>
          <div className="flex items-center gap-2">
      <UserInfo />
          </div>
        </div>
      </Page.Header>

      <Page.Main className="bg-gray-50">
        <div className="px-4 py-6">
          <div 
            className="rounded-2xl p-6 mb-8 text-white shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)'
            }}
          >
            <div className="text-center">
              <h2 className="text-sm font-semibold uppercase text-gray-400 mb-2">Total Balance (USD)</h2>
              <p className="text-3xl font-bold tracking-tight">
                {totalValueDisplay}
              </p>
              <div className="mt-4 text-xs text-gray-400 truncate">
                {address ?? 'Not connected'}
              </div>
            </div>
          </div>
        
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <h3 className="text-sm font-medium text-gray-500">RVZ Balance</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{rvzBalanceDisplay}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <h3 className="text-sm font-medium text-gray-500">WLD Balance</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{wldBalanceDisplay}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity (Mock)</h3>
            <div className="space-y-3">
              {mockTransactions.map(tx => (
                <div key={tx.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{tx.token} Transfer</p>
                    <p className="text-sm text-gray-500">{tx.date}</p>
              </div>
                  <p className={`font-semibold ${tx.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount} {tx.token}
                  </p>
              </div>
              ))}
            </div>
          </div>

        </div>
      </Page.Main>
    </Page>
  );
} 