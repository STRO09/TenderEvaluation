import { ReactNode } from 'react';
import { GovSidebar } from './GovSidebar';
import { Header } from './Header';

interface GovPortalLayoutProps {
  children: ReactNode;
}

export function GovPortalLayout({ children }: GovPortalLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <GovSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
