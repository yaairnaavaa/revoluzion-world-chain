import { auth } from '@/auth';
import { Page } from '@/components/PageLayout';
import { UserInfo } from '@/components/UserInfo';
import { Marble, TopBar } from '@worldcoin/mini-apps-ui-kit-react';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();

  const petitions = [
    {
      id: 1,
      title: 'Protect the Amazon Rainforest',
      description: 'Stop deforestation and preserve our planet\'s lungs for future generations.',
      supporters: 1250,
      goal: 5000,
      category: 'Environment',
      urgency: 'High',
    },
    {
      id: 2,
      title: 'Fund Universal Basic Income Study',
      description: 'Support research on UBI to create a more equitable economic system.',
      supporters: 850,
      goal: 2000,
      category: 'Economics',
      urgency: 'Medium',
    },
    {
      id: 3,
      title: 'Clean Up Our Oceans',
      description: 'Remove plastic waste and restore marine ecosystems worldwide.',
      supporters: 3400,
      goal: 10000,
      category: 'Environment',
      urgency: 'High',
    },
    {
      id: 4,
      title: 'Education for All Children',
      description: 'Ensure every child has access to quality education regardless of location.',
      supporters: 2100,
      goal: 7500,
      category: 'Education',
      urgency: 'Medium',
    },
  ];

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
              {petitions.map((petition) => {
                const progress = (petition.supporters / petition.goal) * 100;
                const isUrgent = petition.urgency === 'High';
                
                return (
                  <div key={petition.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            isUrgent 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {petition.category}
                          </span>
                          {isUrgent && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
                              Urgent
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2 leading-tight">
                          {petition.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                          {petition.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold text-gray-900">
                          {petition.supporters.toLocaleString()} supporters
                        </span>
                        <span className="text-gray-600">
                          {petition.goal.toLocaleString()} goal
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round(progress)}% complete
                      </div>
                    </div>
                    
                    <button className="w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-red-700 transition-colors duration-200 shadow-sm">
                      Support This Petition
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Page.Main>
    </>
  );
}
