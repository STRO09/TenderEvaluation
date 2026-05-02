import CreateTenderWizard from '@/components/tenders/create/CreateTenderWizard';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CreateTenderPage() {
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/government/tenders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New Tender</h1>
          <p className="text-muted-foreground mt-2">Define the tender rules and requirements</p>
        </div>
      </div>

      <CreateTenderWizard />
    </div>
  );
}
