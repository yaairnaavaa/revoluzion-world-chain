'use client';

import { auth } from '@/auth';
import { Page } from '@/components/PageLayout';
import { UserInfo } from '@/components/UserInfo';
import { MiniKit } from '@worldcoin/minikit-js';
import Link from 'next/link';
import PetitionRegistryABI from '@/abi/PetitionRegistry.json';
import { useState, useEffect } from 'react';
import { createPublicClient, http } from 'viem';
import { worldchain } from 'viem/chains';

const PETITION_REGISTRY_ADDRESS = '0x...'; // Set your deployed contract address

export default function Home() {
  const [petitions, setPetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const client = createPublicClient({
    chain: worldchain,
    transport: http('https://worldchain-mainnet.g.alchemy.com/public'),
  });

  useEffect(() => {
    async function fetchPetitions() {
      try {
        const petitionCount = await client.readContract({
          address: PETITION_REGISTRY_ADDRESS,
          abi: PetitionRegistryABI,
          functionName: 'petitionCount',
        }) as bigint;

        const petitionsData = [];
        for (let i = 1; i <= petitionCount; i++) {
          const petition = await client.readContract({
            address: PETITION_REGISTRY_ADDRESS,
            abi: PetitionRegistryABI,
            functionName: 'getPetition',
            args: [BigInt(i)],
          });
          petitionsData.push(petition);
        }
        setPetitions(petitionsData);
      } catch (error) {
        console.error('Error fetching petitions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPetitions();
  }, []);

  return (
    <>
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
      <Page.Main className="bg-gray-50 pb-20">
        <div className="px-4 py-6">
          {/* Hero Section */}
          <div 
            className="rounded-2xl p-6 mb-8 text-white shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
            }}
          >
            <div className="text-center">
              <div className="mb-4">
                <img 
                  src="/logo.png" 
                  alt="Revoluzion Logo" 
                  className="mx-auto h-16 w-16 rounded-full"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h1 className="text-2xl font-bold mb-2">
                Revoluzion. Your voice matters.
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: '#fee2e2' }}>
                Create or support petitions securely with your human identity.
              </p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Create a Petition</h3>
                  <p className="text-gray-600 text-sm mb-4">Start a movement and gather support for your cause</p>
                </div>
                <div className="ml-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-xl font-bold">+</span>
                  </div>
                </div>
              </div>
              <Link href="/create-petition">
                <button className="w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-red-700 transition-colors duration-200 shadow-sm">
                  Start Creating
                </button>
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Support a Cause</h3>
                  <p className="text-gray-600 text-sm mb-4">Browse and support existing petitions</p>
                </div>
                <div className="ml-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-700 text-xl">♥</span>
                  </div>
                </div>
              </div>
              <button className="w-full bg-gray-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors duration-200 shadow-sm">
                Browse Petitions
              </button>
            </div>
          </div>

          {/* Trending Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Trending Now</h2>
              <button className="text-red-600 text-sm font-semibold">View All</button>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <p>Loading petitions...</p>
              ) : (
                <ul>
                  {petitions.map((petition) => (
                    <li key={petition.id.toString()}>
                      <Link href={`/petition/${petition.id.toString()}`}>
                        {petition.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </Page.Main>
    </>
  );
}
