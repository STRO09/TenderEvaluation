'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Compass,
  FileText,
  LogOut,
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

export function CompanySidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-card">
      <div className="p-6">
        <Link href="/company/dashboard" className="block">
          <h1 className="text-xl font-bold">Procurement</h1>
          <p className="text-xs text-muted-foreground">Company Portal</p>
        </Link>
      </div>

      <nav className="space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

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

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-card w-64">
        <Link href="/auth" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors w-full text-left">
          <LogOut className="w-4 h-4" />
          Switch Role
        </Link>
      </div>
    </aside>
  );
}
