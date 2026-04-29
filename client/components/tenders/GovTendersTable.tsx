'use client';

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
import { MoreHorizontal, Eye } from 'lucide-react';
import Link from 'next/link';

export interface GovTender {
  id: string;
  title: string;
  department: string;
  deadline: Date;
  budget: {
    min: number;
    max: number;
  };
  status: 'draft' | 'published' | 'closed';
  submissions: number;
  eligible: number;
}

interface GovTendersTableProps {
  tenders: GovTender[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

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

export function GovTendersTable({ tenders, onEdit, onDelete }: GovTendersTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Submissions</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenders.map((tender) => (
            <TableRow key={tender.id}>
              <TableCell className="font-medium">{tender.title}</TableCell>
              <TableCell>{tender.department}</TableCell>
              <TableCell>{formatDate(tender.deadline)}</TableCell>
              <TableCell className="text-sm">
                {formatCurrency(tender.budget.min)} - {formatCurrency(tender.budget.max)}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {tender.eligible}/{tender.submissions}
                </div>
                <span className="text-xs text-muted-foreground">eligible</span>
              </TableCell>
              <TableCell>
                <StatusBadge status={tender.status === 'draft' ? 'processing' : 'eligible'} label={tender.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <Link href={`/government/tenders/${tender.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  {tender.status === 'draft' && onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(tender.id)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
