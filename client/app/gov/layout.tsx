import type { Metadata } from 'next';
import { GovPortalLayout } from '@/components/layout/GovPortalLayout';

export const metadata: Metadata = {
  title: 'Government Portal - Procurement Platform',
  description: 'Manage tenders and evaluate submissions',
};

export default function GovernmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GovPortalLayout>
      {children}
    </GovPortalLayout>
  );
}
