import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/common/EmptyState';
import { FileText } from 'lucide-react';

export default function GovSubmissionsPage() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Submissions</h1>
        <p className="text-muted-foreground mt-2">Evaluate company submissions and make decisions</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
          <p className="text-2xl font-bold mt-2">47</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Under Review</p>
          <p className="text-2xl font-bold mt-2">18</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Eligible</p>
          <p className="text-2xl font-bold text-status-eligible mt-2">22</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Rejected</p>
          <p className="text-2xl font-bold text-status-rejected mt-2">7</p>
        </Card>
      </div>

      <EmptyState
        icon={<FileText className="w-12 h-12" />}
        title="Submissions table coming soon"
        description="This page will display all company submissions for evaluation"
      />
    </div>
  );
}
