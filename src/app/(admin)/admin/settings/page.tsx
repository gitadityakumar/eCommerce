import { redirect } from 'next/navigation';
import { getStoreSettings } from '@/lib/actions/settings';
import { getCurrentUser } from '@/lib/auth/actions';
import { SettingsClient } from './SettingsClient';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  const settings = await getStoreSettings();

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <SettingsClient
        initialSettings={settings}
      />
    </div>
  );
}
