import { AwarenessProfileView } from '@/components/profile/awareness-profile';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Awareness profile',
};

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6">
      <AwarenessProfileView />
    </div>
  );
}
