'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Compass,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const navItems = [
  {
    label: 'Dashboard',
    href: '/company/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Explore Tenders',
    href: '/company/explore',
    icon: Compass,
  },
  {
    label: 'My Submissions',
    href: '/company/submissions',
    icon: FileText,
  },
];

function CollapsedTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);

  useEffect(() => {
    if (show && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setTop(rect.top + rect.height / 2);
    }
  }, [show]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className="fixed z-[9999] left-[68px] -translate-y-1/2 pointer-events-none"
          style={{ top }}
        >
          <div className="bg-popover text-popover-foreground text-xs font-medium px-2.5 py-1.5 rounded-md shadow-md border whitespace-nowrap">
            {label}
          </div>
        </div>
      )}
    </div>
  );
}

interface CompanySidebarProps { 
  isOpen : boolean;
  onToggle: () => void;
}

export function CompanySidebar({isOpen, onToggle} : CompanySidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-screen bg-card border-r flex flex-col z-50 transition-all duration-300',
      isOpen ? 'w-60' : 'w-[60px]'
      )}
    >
      {/* Toggle button — floats on the right edge */}
      <button
        onClick={onToggle}
        className="absolute -right-3.5 top-5 z-50 w-7 h-7 rounded-full bg-card border shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
        aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isOpen
          ? <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
          : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        }
      </button>

      {/* Logo */}
      <div
        className={cn(
          'flex items-center border-b h-14 flex-shrink-0 overflow-hidden transition-all duration-300',
          isOpen ? 'px-5 gap-3' : 'justify-center'
        )}
      >
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-primary-foreground" />
        </div>
        {isOpen && (
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight truncate">Procurement</p>
            <p className="text-[11px] text-muted-foreground leading-tight">Government Portal</p>
          </div>
        )}
      </div>

        <nav className={cn('flex-1 py-3 space-y-0.5 overflow-y-auto', isOpen ? 'px-3' : 'px-2')}>
        {isOpen && (
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 pb-2 pt-1 select-none">
            Navigation
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          if (!isOpen) {
            return (
              <CollapsedTooltip key={item.href} label={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center justify-center w-full h-9 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                </Link>
              </CollapsedTooltip>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={cn('border-t flex-shrink-0 py-3', isOpen ? 'px-3' : 'px-2')}>
        {isOpen ? (
          <Link
            href="/auth"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Switch Role</span>
          </Link>
        ) : (
          <CollapsedTooltip label="Switch Role">
            <Link
              href="/auth"
              className="flex items-center justify-center w-full h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </CollapsedTooltip>
        )}
      </div>
    </aside>
  );
}
