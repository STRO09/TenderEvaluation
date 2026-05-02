'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { TenderFormData } from './CreateTenderWizard';

interface Step1Props {
  data: TenderFormData;
  onUpdate: (updates: Partial<TenderFormData>) => void;
}

const departments = ['Transportation', 'Health', 'IT', 'Education', 'Infrastructure', 'Defense'];
const categories = ['Goods & Services', 'Construction', 'Professional Services', 'Equipment & Machinery', 'Supplies & Consumables'];

const toDateString = (d: Date | null) => (d ? d.toISOString().split('T')[0] : '');
const fromDateString = (s: string) => (s ? new Date(s) : null);

export function Step1BasicDetails({ data, onUpdate }: Step1Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Tender Title *</label>
        <Input
          placeholder="e.g., Infrastructure Development Project"
          value={data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Department *</label>
          <Select value={data.department} onValueChange={(v) => onUpdate({ department: v })}>
            <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
            <SelectContent>
              {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <Select value={data.category} onValueChange={(v) => onUpdate({ category: v })}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <Textarea
          placeholder="Describe the tender scope and requirements..."
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Submission Opens *</label>
          <Input
            type="date"
            value={toDateString(data.submissionStartDate)}
            onChange={(e) => onUpdate({ submissionStartDate: fromDateString(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Submission Deadline *</label>
          <Input
            type="date"
            value={toDateString(data.submissionDeadline)}
            onChange={(e) => onUpdate({ submissionDeadline: fromDateString(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Budget Min (INR) *</label>
          <Input
            type="number"
            placeholder="0"
            value={data.budgetMin || ''}
            onChange={(e) => onUpdate({ budgetMin: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Budget Max (INR) *</label>
          <Input
            type="number"
            placeholder="0"
            value={data.budgetMax || ''}
            onChange={(e) => onUpdate({ budgetMax: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
    </div>
  );
}