'use client';

import { Page } from '@/components/PageLayout';
import { UserInfo } from '@/components/UserInfo';
import { AuthButton } from '@/components/AuthButton';

export default function Profile() {
  return (
    <Page>
      <UserInfo />
      <div className="flex flex-col items-center justify-center space-y-8">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p>This is your profile page.</p>
        <AuthButton />
      </div>
    </Page>
  );
} 