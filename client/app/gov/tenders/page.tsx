'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GovTendersTable, type GovTender } from '@/components/tenders/GovTendersTable';
import { FilterPanel, type FilterConfig } from '@/components/common/FilterPanel';
import { EmptyState } from '@/components/common/EmptyState';
import { Plus, FileText } from 'lucide-react';
import Link from 'next/link';

// Mock data
const mockTenders: GovTender[] = [
  {
    id: 'TEN-2024-001',
    title: 'Infrastructure Development Project',
    department: 'Transportation',
    deadline: new Date('2024-06-30'),
    budget: { min: 100000, max: 500000 },
    status: 'published',
    submissions: 12,
    eligible: 8,
  },
  {
    id: 'TEN-2024-002',
    title: 'Software License Procurement',
    department: 'IT',
    deadline: new Date('2024-05-15'),
    budget: { min: 50000, max: 150000 },
    status: 'published',
    submissions: 7,
    eligible: 5,
  },
  {
    id: 'TEN-2024-003',
    title: 'Healthcare Equipment Supply',
    department: 'Health',
    deadline: new Date('2024-07-20'),
    budget: { min: 200000, max: 800000 },
    status: 'draft',
    submissions: 0,
    eligible: 0,
  },
];

const filterConfigs: FilterConfig[] = [
  {
    id: 'department',
    label: 'Department',
    type: 'select',
    options: [
      { value: 'transportation', label: 'Transportation' },
      { value: 'it', label: 'IT' },
      { value: 'health', label: 'Health' },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'closed', label: 'Closed' },
    ],
  },
];

export default function GovTendersPage() {
  const [filteredTenders, setFilteredTenders] = useState<GovTender[]>(mockTenders);

  const handleApplyFilters = (filters: Record<string, string | string[]>) => {
    let result = mockTenders;

    if (filters.department) {
      result = result.filter((t) => t.department.toLowerCase().includes(filters.department as string));
    }

    if (filters.status) {
      result = result.filter((t) => t.status === filters.status);
    }

    setFilteredTenders(result);
  };

  const handleResetFilters = () => {
    setFilteredTenders(mockTenders);
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tenders</h1>
          <p className="text-muted-foreground mt-2">Manage and monitor all tenders</p>
        </div>
        {/* <Link href="/gov/tenders/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Tender
          </Button>
        </Link> */}
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Total Tenders</p>
          <p className="text-2xl font-bold mt-2">{mockTenders.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Published</p>
          <p className="text-2xl font-bold mt-2">{mockTenders.filter((t) => t.status === 'published').length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
          <p className="text-2xl font-bold mt-2">{mockTenders.reduce((sum, t) => sum + t.submissions, 0)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Eligible Submissions</p>
          <p className="text-2xl font-bold mt-2">{mockTenders.reduce((sum, t) => sum + t.eligible, 0)}</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div>
          <FilterPanel
            filters={filterConfigs}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        </div>

        <div className="lg:col-span-3">
          {filteredTenders.length > 0 ? (
            <GovTendersTable tenders={filteredTenders} />
          ) : (
            <EmptyState
              icon={<FileText className="w-12 h-12" />}
              title="No tenders found"
              description="Try adjusting your filters or create a new tender"
              action={
                <Link href="/gov/tenders/create">
                  <Button>Create Tender</Button>
                </Link>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
