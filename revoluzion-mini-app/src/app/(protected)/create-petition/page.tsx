import { auth } from '@/auth';
import { Page } from '@/components/PageLayout';
import { UserInfo } from '@/components/UserInfo';

export default async function CreatePetition() {
  const session = await auth();

  return (
    <>
      <Page.Header className="p-0 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <button className="text-red-600 font-semibold">← Back</button>
          </div>
          <h1 className="text-lg font-bold text-black">Create Petition</h1>
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
                  className="mx-auto h-12 w-12 rounded-full"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h1 className="text-xl font-bold mb-2">
                Start Your Revolution
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: '#fee2e2' }}>
                Create a petition that can change the world
              </p>
            </div>
          </div>

          {/* Form Section */}
          <form className="space-y-6">
            {/* Petition Title */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Petition Title *
              </label>
              <input
                type="text"
                placeholder="What change do you want to see?"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">Make it clear and compelling</p>
            </div>

            {/* Category Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Category *
              </label>
              <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none">
                <option value="">Select a category</option>
                <option value="environment">Environment</option>
                <option value="human-rights">Human Rights</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="economics">Economics</option>
                <option value="politics">Politics</option>
                <option value="technology">Technology</option>
                <option value="social-justice">Social Justice</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tell Your Story *
              </label>
              <textarea
                placeholder="Explain why this petition matters. What's the problem? What solution are you proposing? Why should people care?"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none h-32 resize-none"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">Be specific and passionate</p>
            </div>

            {/* Target Audience */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Who can make this change happen? *
              </label>
              <input
                type="text"
                placeholder="e.g., Mayor of New York, Congress, Company CEO"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Who has the power to address this issue?</p>
            </div>

            {/* Goal */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Signature Goal
              </label>
              <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none">
                <option value="100">100 signatures</option>
                <option value="500">500 signatures</option>
                <option value="1000">1,000 signatures</option>
                <option value="5000">5,000 signatures</option>
                <option value="10000">10,000 signatures</option>
                <option value="50000">50,000 signatures</option>
                <option value="100000">100,000 signatures</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">You can always increase this later</p>
            </div>

            {/* Urgency Level */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="urgency" value="low" className="mr-2" />
                  <span className="text-sm">Low</span>
                </label>
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="urgency" value="medium" className="mr-2" />
                  <span className="text-sm">Medium</span>
                </label>
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="urgency" value="high" className="mr-2" />
                  <span className="text-sm">High</span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                className="w-full bg-red-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-red-700 transition-colors duration-200 shadow-sm"
              >
                Launch Your Petition
              </button>
              <button
                type="button"
                className="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors duration-200"
              >
                Save as Draft
              </button>
            </div>
          </form>
        </div>
      </Page.Main>
    </>
  );
} 