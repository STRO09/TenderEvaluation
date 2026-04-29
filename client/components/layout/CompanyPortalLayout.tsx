'use client';
import { useState, ReactNode } from 'react';
import { CompanySidebar } from './CompanySidebar';
import { Header } from './Header';

interface CompanyPortalLayoutProps {
  children: ReactNode;
}

export function CompanyPortalLayout({ children }: CompanyPortalLayoutProps) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar isOpen={isOpen} onToggle={() => setIsOpen((v) => !v)} />
      <div className="flex-1 flex flex-col">
        <main          
          className="transition-all duration-300 min-h-screen"
          style={{ marginLeft: isOpen ? '240px' : '60px' }}>
          <Header />
          {children}
        </main>
      </div>
    </div>
  );
}
