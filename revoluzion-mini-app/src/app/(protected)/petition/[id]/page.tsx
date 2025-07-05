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

const PETITION_REGISTRY_ADDRESS = '0x...'; // Set your deployed contract address

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
      if (petitionId > 0) {
        try {
          const data = await client.readContract({
            address: PETITION_REGISTRY_ADDRESS,
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
        setSupportStatus('success');
        setIsSupporting(false);
        // Re-fetch petition data to show updated support count
      } else if (isTransactionError) {
        setSupportStatus('error');
        setIsSupporting(false);
      }
    }
  }, [isConfirmed, isConfirming, isTransactionError, transactionId]);

  const handleSupport = async () => {
    setIsSupporting(true);
    setSupportStatus('pending');
    setTransactionId('');

    try {
      // 1. Get World ID proof
      const { proof, nullifier_hash, merkle_root } = await MiniKit.commands.verify({
        signal: '0x...', // Logged-in user's address from session
        action: `support-petition-${petitionId}`,
      });

      // 2. Send transaction with proof
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: PETITION_REGISTRY_ADDRESS,
            abi: PetitionRegistryABI,
            functionName: 'supportPetition',
            args: [
              petitionId,
              merkle_root,
              nullifier_hash,
              proof,
            ],
          },
        ],
      });

      if (finalPayload.status === 'success') {
        setTransactionId(finalPayload.transaction_id);
      } else {
        setSupportStatus('error');
        setIsSupporting(false);
      }
    } catch (err) {
      console.error('Error supporting petition:', err);
      setSupportStatus('error');
      setIsSupporting(false);
    }
  };
  
  if (!petition) return <div>Loading...</div>;

  return (
    <>
      <Page.Header>
        <UserInfo />
      </Page.Header>
      <Page.Main>
        <h1>{petition.title}</h1>
        <p>{petition.description}</p>
        <p>Goal: {petition.goal.toString()}</p>
        <p>Supporters: {petition.supportCount.toString()}</p>

        <button onClick={handleSupport} disabled={isSupporting}>
          {isSupporting ? 'Supporting...' : 'Support this Petition'}
        </button>
        
        {supportStatus === 'success' && <p>Thank you for your support!</p>}
        {supportStatus === 'error' && <p>Failed to record your support. Please try again.</p>}
      </Page.Main>
    </>
  );
} 