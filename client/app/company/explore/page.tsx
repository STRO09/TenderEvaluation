import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, MapPin, DollarSign } from 'lucide-react';

interface TenderCard {
  id: string;
  title: string;
  department: string;
  deadline: Date;
  budget: {
    min: number;
    max: number;
  };
  eligible: boolean;
  riskAreas?: string[];
}

const mockTenders: TenderCard[] = [
  {
    id: 'TEN-2024-001',
    title: 'Infrastructure Development Project',
    department: 'Transportation',
    deadline: new Date('2024-06-30'),
    budget: { min: 100000, max: 500000 },
    eligible: true,
  },
  {
    id: 'TEN-2024-002',
    title: 'Software License Procurement',
    department: 'IT',
    deadline: new Date('2024-05-15'),
    budget: { min: 50000, max: 150000 },
    eligible: true,
    riskAreas: ['Low turnover'],
  },
  {
    id: 'TEN-2024-003',
    title: 'Healthcare Equipment Supply',
    department: 'Health',
    deadline: new Date('2024-07-20'),
    budget: { min: 200000, max: 800000 },
    eligible: false,
    riskAreas: ['Missing certification'],
  },
];

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value);
}

export default function CompanyExplorePage() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Explore Tenders</h1>
        <p className="text-muted-foreground mt-2">Discover available procurement opportunities</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockTenders.map((tender) => (
          <Card key={tender.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{tender.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4" />
                {tender.department}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-grow space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Deadline: {formatDate(tender.deadline)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span>
                  {formatCurrency(tender.budget.min)} - {formatCurrency(tender.budget.max)}
                </span>
              </div>

              {tender.riskAreas && tender.riskAreas.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-status-review">Risk Areas:</p>
                  <ul className="text-xs space-y-1">
                    {tender.riskAreas.map((area, idx) => (
                      <li key={idx} className="text-muted-foreground">
                        • {area}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-2 mt-4">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    tender.eligible
                      ? 'bg-status-eligible-bg text-status-eligible'
                      : 'bg-status-rejected-bg text-status-rejected'
                  }`}
                >
                  {tender.eligible ? 'Likely Eligible' : 'May Not Qualify'}
                </span>
              </div>
            </CardContent>

            <div className="p-6 border-t">
              <Link href={`/company/explore/${tender.id}`} className="block">
                <Button className="w-full">View Details</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
