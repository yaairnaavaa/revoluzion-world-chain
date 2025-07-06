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
  const petitionId = params.id ? BigInt(params.id as string) : 0;
  
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

  console.log('Using App ID:', process.env.NEXT_PUBLIC_WLD_APP_ID);

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

    console.log('1. Starting handleSupport...');
    setIsSupporting(true);
    setSupportStatus('pending');
    setTransactionId('');

    try {
      console.log('2. Preparing to send transaction with MiniKit...');
      const txPayload = {
        transaction: [
          {
            address: PETITION_REGISTRY_ADDRESS as `0x${string}`,
            abi: PetitionRegistryABI,
            functionName: 'supportPetition',
            args: [
              petitionId,
              '0x0000000000000000000000000000000000000000000000000000000000000000', // root
              '0x0000000000000000000000000000000000000000000000000000000000000000', // nullifierHash
              [0, 0, 0, 0, 0, 0, 0, 0], // proof
            ],
          },
        ],
        proof: {
            worldId: {
                group_id: '1',
                action: 'support-petition',
                signal: petitionId.toString(),
                credential_type: ['orb'],
            },
        }
      };

      console.log(
        '3. Transaction Payload:',
        JSON.stringify(
          txPayload,
          (key, value) => (typeof value === 'bigint' ? value.toString() : value),
          2
        )
      );

      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction(txPayload as any);
      
      console.log('4. MiniKit response:', finalPayload);

      if (finalPayload.status === 'success') {
        console.log('5. Transaction submitted successfully:', finalPayload.transaction_id);
        setTransactionId(finalPayload.transaction_id);
      } else {
        console.error('5. Transaction submission failed:', finalPayload);
        setSupportStatus('error');
        setIsSupporting(false);
      }
    } catch (err) {
      console.error('6. An error occurred in handleSupport:', err);
      setSupportStatus('error');
      setIsSupporting(false);
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
      <div className="flex flex-col items-center justify-center space-y-8 max-w-2xl mx-auto p-4">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{petition.title}</h1>
          <p className="text-gray-600 mb-6 whitespace-pre-wrap">{petition.description}</p>
          
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

          <div className="mt-6">
            <button
              onClick={handleSupport}
              disabled={isSupporting || supportStatus === 'success'}
              className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {getButtonText()}
            </button>
          </div>

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