import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TenderDetailPage({ params }: { params: { id: string } }) {
  const tender = {
    id: params.id,
    title: 'Infrastructure Development Project',
    department: 'Transportation',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    deadline: '2024-06-30',
    budget: '100,000 - 500,000 USD',
    category: 'Construction',
    status: 'Published',
    submissions: 12,
    eligible: 8,
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Link href="/government/tenders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{tender.title}</h1>
          <p className="text-muted-foreground mt-2">Tender ID: {tender.id}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tender Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <p className="text-lg">{tender.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-lg">{tender.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Deadline</p>
                <p className="text-lg">{tender.deadline}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget Range</p>
                <p className="text-lg">{tender.budget}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Coming soon: Submissions list and management</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold">{tender.submissions}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Eligible</p>
                <p className="text-2xl font-bold text-status-eligible">{tender.eligible}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold">{tender.status}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
