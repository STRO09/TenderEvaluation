'use client';

import { useState, ReactNode } from 'react';

import { GovSidebar } from '@/components/layout/GovSidebar';
import { Header } from './Header';

interface GovPortalLayoutProps {
  children: ReactNode;
}

// This context lets child components (or the sidebar itself) read/set the open state
// if needed — but the simplest fix is to keep state here and pass the offset down.

export function GovPortalLayout({ children} : GovPortalLayoutProps ) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <GovSidebar isOpen={isOpen} onToggle={() => setIsOpen((v) => !v)} />

      <div className="flex-1 flex flex-col">
        {/* Main content — left margin matches sidebar width exactly */}
        <main
          className="transition-all duration-300 min-h-screen"
          style={{ marginLeft: isOpen ? '240px' : '60px' }}
        >
          <Header />
          {children}
        </main>
      </div>
    </div>
  );
}