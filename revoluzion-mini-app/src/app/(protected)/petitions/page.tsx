'use client';

import { Page } from '@/components/PageLayout';
import { UserInfo } from '@/components/UserInfo';
import Link from 'next/link';
import PetitionRegistryABI from '@/abi/PetitionRegistry.json';
import { useState, useEffect } from 'react';
import { createPublicClient, http } from 'viem';
import { worldchain } from 'viem/chains';
import { PETITION_REGISTRY_ADDRESS } from '@/lib/contracts';

const mockPetitions = [
  {
    id: 'mock-1',
    title: 'Mock Petition: More Water Fountains',
    description: 'A petition to install more water fountains across the city parks.',
    signatures: '42',
  },
  {
    id: 'mock-2',
    title: 'Mock Petition: Pedestrian-Only Streets on Weekends',
    description: 'Proposal to make downtown streets pedestrian-only during weekends to promote local businesses and reduce pollution.',
    signatures: '128',
  },
];

export default function Petitions() {
  const [petitions, setPetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPetitions = async () => {
      if (!PETITION_REGISTRY_ADDRESS || PETITION_REGISTRY_ADDRESS === '0x') {
        console.warn('PetitionRegistry contract address not set, using mock data.');
        setPetitions(mockPetitions);
        setLoading(false);
        return;
      }

      const client = createPublicClient({
        chain: worldchain,
        transport: http(),
      });

      try {
        // Get petition count first
        const count = await client.readContract({
          address: PETITION_REGISTRY_ADDRESS as `0x${string}`,
          abi: PetitionRegistryABI,
          functionName: 'petitionCount',
        });

        const petitionCount = Number(count);
        const fetchedPetitions = [];

        // Fetch each petition
        for (let i = 1; i <= petitionCount; i++) {
          try {
            const petition = await client.readContract({
              address: PETITION_REGISTRY_ADDRESS as `0x${string}`,
              abi: PetitionRegistryABI,
              functionName: 'getPetition',
              args: [BigInt(i)],
            });
            fetchedPetitions.push(petition);
          } catch (error) {
            console.error(`Error fetching petition ${i}:`, error);
          }
        }

        setPetitions(fetchedPetitions.length > 0 ? fetchedPetitions : mockPetitions);
      } catch (error) {
        console.error('Error fetching petitions:', error);
        setPetitions(mockPetitions);
      } finally {
        setLoading(false);
      }
    };

    fetchPetitions();
  }, []);

  return (
    <Page>
      <UserInfo />
      <div className="flex flex-col items-center justify-center space-y-8">
        <h1 className="text-2xl font-bold">Petitions</h1>
        
        {loading ? (
          <div className="flex justify-center items-center">
            <p>Loading petitions...</p>
          </div>
        ) : (
          <div className="w-full max-w-2xl space-y-4">
            {petitions.map((petition, index) => (
              <div key={petition.id || `mock-${index}`} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {petition.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {petition.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {petition.supportCount || petition.signatures} supporters
                  </span>
                  {petition.id && petition.id !== 'mock-1' && petition.id !== 'mock-2' && (
                    <Link 
                      href={`/petition/${petition.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            ))}
            
            <div className="text-center pt-4">
              <Link 
                href="/create-petition"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Create New Petition
              </Link>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
} 