'use client';

import { Page } from '@/components/PageLayout';
import { UserInfo } from '@/components/UserInfo';
import PetitionRegistryABI from '@/abi/PetitionRegistry.json';
import { useState, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react';
import { createPublicClient, http } from 'viem';
import { worldchain } from 'viem/chains';
import { useParams } from 'next/navigation';
import { PETITION_REGISTRY_ADDRESS } from '@/lib/contracts';

export default function PetitionPage() {
  const params = useParams();
  const petitionId = params.id ? BigInt(params.id as string) : 0n;
  
  const [petition, setPetition] = useState<any>(null);
  const [isSupporting, setIsSupporting] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [supportStatus, setSupportStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  const client = createPublicClient({
    chain: worldchain,
    transport: http('https://worldchain-mainnet.g.alchemy.com/public'),
  });

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isTransactionError,
    error: transactionError,
  } = useWaitForTransactionReceipt({
    client: client,
    appConfig: {
      app_id: process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`,
    },
    transactionId: transactionId,
  });

  useEffect(() => {
    async function fetchPetition() {
      if (petitionId > 0 && PETITION_REGISTRY_ADDRESS && PETITION_REGISTRY_ADDRESS !== '0x') {
        try {
          const data = await client.readContract({
            address: PETITION_REGISTRY_ADDRESS as `0x${string}`,
            abi: PetitionRegistryABI,
            functionName: 'getPetition',
            args: [petitionId],
          });
          setPetition(data);
        } catch (error) {
          console.error('Error fetching petition:', error);
        }
      }
    }
    fetchPetition();
  }, [petitionId]);

  useEffect(() => {
    if (transactionId && !isConfirming) {
      if (isConfirmed) {
        console.log('Support transaction confirmed!');
        setSupportStatus('success');
        setIsSupporting(false);
        // Refresh petition data
        setTimeout(() => {
          setSupportStatus('idle');
        }, 5000);
      } else if (isTransactionError) {
        console.error('Support transaction failed:', transactionError);
        setSupportStatus('error');
        setIsSupporting(false);
        setTimeout(() => {
          setSupportStatus('idle');
        }, 5000);
      }
    }
  }, [isConfirmed, isConfirming, isTransactionError, transactionError, transactionId]);

  const handleSupport = async () => {
    if (!petition || isSupporting) return;

    setIsSupporting(true);
    setSupportStatus('pending');
    setTransactionId('');

    try {
      // This would require World ID verification
      // For now, this is a placeholder implementation
      console.log('Supporting petition:', petitionId);
      
      // In a real implementation, you would:
      // 1. Generate World ID proof
      // 2. Call supportPetition function with the proof
      
      // Mock success for now
      setTimeout(() => {
        setSupportStatus('success');
        setIsSupporting(false);
        setTimeout(() => {
          setSupportStatus('idle');
        }, 3000);
      }, 2000);

    } catch (err) {
      console.error('Error supporting petition:', err);
      setSupportStatus('error');
      setIsSupporting(false);
      setTimeout(() => {
        setSupportStatus('idle');
      }, 5000);
    }
  };

  const getButtonText = () => {
    switch (supportStatus) {
      case 'pending':
        return 'Supporting...';
      case 'success':
        return 'Supported!';
      case 'error':
        return 'Failed - Try Again';
      default:
        return 'Support This Petition';
    }
  };

  if (!petition) {
    return (
      <Page>
        <UserInfo />
        <div className="flex flex-col items-center justify-center space-y-8">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <UserInfo />
      <div className="flex flex-col items-center justify-center space-y-8 max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{petition.title}</h1>
          <p className="text-gray-600 mb-6">{petition.description}</p>
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-sm text-gray-500">Current Support:</span>
              <span className="text-lg font-semibold text-gray-900 ml-2">
                {petition.supportCount?.toString() || '0'} / {petition.goal?.toString() || '100'}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Created:</span>
              <span className="text-sm text-gray-700 ml-2">
                {petition.createdAt ? new Date(Number(petition.createdAt) * 1000).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min(100, (Number(petition.supportCount || 0) / Number(petition.goal || 100)) * 100)}%` 
              }}
            ></div>
          </div>

          <button
            onClick={handleSupport}
            disabled={isSupporting || supportStatus === 'success'}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              supportStatus === 'success'
                ? 'bg-green-600 text-white'
                : supportStatus === 'error'
                ? 'bg-red-600 text-white'
                : isSupporting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {getButtonText()}
          </button>

          {supportStatus === 'error' && (
            <p className="text-red-600 text-sm mt-2 text-center">
              Failed to support petition. Please try again.
            </p>
          )}
          
          {supportStatus === 'success' && (
            <p className="text-green-600 text-sm mt-2 text-center">
              Thank you for your support!
            </p>
          )}
        </div>
      </div>
    </Page>
  );
} 