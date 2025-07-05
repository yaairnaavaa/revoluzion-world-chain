'use client';

import { Page } from '@/components/PageLayout';
import { UserInfo } from '@/components/UserInfo';

export default function Petitions() {
  return (
    <Page>
      <UserInfo />
      <div className="flex flex-col items-center justify-center space-y-8">
        <h1 className="text-2xl font-bold">Petitions</h1>
        <p>This page will display all the petitions.</p>
      </div>
    </Page>
  );
} 