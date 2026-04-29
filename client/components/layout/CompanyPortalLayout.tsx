import { ReactNode } from 'react';
import { CompanySidebar } from './CompanySidebar';
import { Header } from './Header';

interface CompanyPortalLayoutProps {
  children: ReactNode;
}

export function CompanyPortalLayout({ children }: CompanyPortalLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
