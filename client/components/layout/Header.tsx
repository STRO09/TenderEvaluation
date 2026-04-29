import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-card">
      <div className="flex items-center justify-between h-16 px-8">
        <div>
          <h2 className="text-xl font-semibold">Procurement Platform</h2>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
