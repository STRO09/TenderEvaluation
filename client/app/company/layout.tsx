import type { Metadata } from 'next';
import { CompanyPortalLayout } from '@/components/layout/CompanyPortalLayout';

export const metadata: Metadata = {
  title: 'Company Portal - Procurement Platform',
  description: 'Discover tenders and submit applications',
};

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CompanyPortalLayout>
      {children}
    </CompanyPortalLayout>
  );
}
