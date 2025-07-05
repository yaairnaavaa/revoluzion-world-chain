'use client';

import { Page } from '@/components/PageLayout';
import { UserInfo } from '@/components/UserInfo';
import Link from 'next/link';

const mockPetitions = [
  {
    id: '1',
    title: 'Improve Public Transportation',
    description: 'A petition to expand and improve the public transportation network.',
    signatures: 1234,
  },
  {
    id: '2',
    title: 'Plant More Trees in Urban Areas',
    description: 'A call to action to increase green spaces in our city.',
    signatures: 5678,
  },
];

export default function Home() {
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
                <ul>
                {mockPetitions.map((petition) => (
                  <li key={petition.id}>
                    <Link href={`/petition/${petition.id}`}>
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:border-gray-200 transition-all">
                        <h3 className="font-bold text-gray-900">{petition.title}</h3>
                        <p className="text-sm text-gray-600">{petition.description}</p>
                        <p className="text-sm text-gray-500 mt-2">{petition.signatures} signatures</p>
                      </div>
                      </Link>
                    </li>
                  ))}
                </ul>
            </div>
          </div>
        </div>
      </Page.Main>
    </>
  );
}
