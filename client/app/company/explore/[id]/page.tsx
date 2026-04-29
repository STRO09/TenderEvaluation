import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CriteriaChecklistItem } from '@/components/common/CriteriaChecklistItem';
import { ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function CompanyTenderDetailPage({ params }: { params: { id: string } }) {
  const tender = {
    id: params.id,
    title: 'Infrastructure Development Project',
    department: 'Transportation',
    description: 'Development of transportation infrastructure for improved connectivity.',
    deadline: new Date('2024-06-30'),
    budget: { min: 100000, max: 500000 },
    daysLeft: 67,
    eligibilityCriteria: [
      { name: 'Minimum Annual Turnover', likely: true },
      { name: 'Valid GST Registration', likely: true },
      { name: 'No Prior Defaults', likely: false, risk: 'Check if any defaults exist' },
      { name: 'Construction Experience', likely: true },
    ],
    requiredDocuments: [
      { name: 'GST Certificate', mandatory: true },
      { name: 'Balance Sheet (Last 3 Years)', mandatory: true },
      { name: 'Experience Proof', mandatory: true },
      { name: 'Bank Details', mandatory: true },
    ],
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Link href="/company/explore">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-grow">
          <h1 className="text-3xl font-bold">{tender.title}</h1>
          <p className="text-muted-foreground mt-2">{tender.department} Department</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tender Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="mt-1">{tender.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget Range</p>
                <p className="mt-1 text-lg font-semibold">
                  ${tender.budget.min.toLocaleString()} - ${tender.budget.max.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Eligibility Check</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tender.eligibilityCriteria.map((criterion, idx) => (
                <CriteriaChecklistItem
                  key={idx}
                  name={criterion.name}
                  status={criterion.likely ? 'eligible' : 'review'}
                  explanation={criterion.risk}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tender.requiredDocuments.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    <div className="flex-grow">
                      <p className="font-medium">{doc.name}</p>
                    </div>
                    {doc.mandatory && (
                      <span className="text-xs font-semibold text-red-600">Required</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submission Deadline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Closes on</p>
                  <p className="font-semibold">
                    {tender.deadline.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="bg-status-review-bg p-3 rounded-lg">
                <p className="text-sm font-semibold text-status-review">
                  {tender.daysLeft} days remaining
                </p>
              </div>
            </CardContent>
          </Card>

          <Link href={`/company/submissions/${params.id}/apply`} className="block">
            <Button className="w-full" size="lg">
              Start Submission
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
