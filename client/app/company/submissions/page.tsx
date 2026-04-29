import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfidenceIndicator } from '@/components/common/ConfidenceIndicator';
import { Eye } from 'lucide-react';
import Link from 'next/link';

interface Submission {
  id: string;
  tenderTitle: string;
  status: 'eligible' | 'rejected' | 'review';
  confidence: number;
  submittedAt: Date;
  lastUpdated: Date;
}

const mockSubmissions: Submission[] = [
  {
    id: 'SUB-2024-001',
    tenderTitle: 'Infrastructure Development Project',
    status: 'eligible',
    confidence: 0.92,
    submittedAt: new Date('2024-04-01'),
    lastUpdated: new Date('2024-04-15'),
  },
  {
    id: 'SUB-2024-002',
    tenderTitle: 'Software License Procurement',
    status: 'review',
    confidence: 0.65,
    submittedAt: new Date('2024-04-05'),
    lastUpdated: new Date('2024-04-20'),
  },
  {
    id: 'SUB-2024-003',
    tenderTitle: 'Healthcare Equipment Supply',
    status: 'rejected',
    confidence: 0.28,
    submittedAt: new Date('2024-04-10'),
    lastUpdated: new Date('2024-04-18'),
  },
];

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function CompanySubmissionsPage() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">My Submissions</h1>
        <p className="text-muted-foreground mt-2">Track your tender applications</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Total</p>
          <p className="text-2xl font-bold mt-2">{mockSubmissions.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Eligible</p>
          <p className="text-2xl font-bold text-status-eligible mt-2">
            {mockSubmissions.filter((s) => s.status === 'eligible').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Under Review</p>
          <p className="text-2xl font-bold text-status-review mt-2">
            {mockSubmissions.filter((s) => s.status === 'review').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Rejected</p>
          <p className="text-2xl font-bold text-status-rejected mt-2">
            {mockSubmissions.filter((s) => s.status === 'rejected').length}
          </p>
        </Card>
      </div>

      <Card>
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">Submission History</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tender</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.tenderTitle}</TableCell>
                  <TableCell>
                    <StatusBadge status={submission.status} />
                  </TableCell>
                  <TableCell>
                    <div className="w-32">
                      <ConfidenceIndicator score={submission.confidence} label="" showPercentage={true} />
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                  <TableCell>{formatDate(submission.lastUpdated)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/company/submissions/${submission.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
