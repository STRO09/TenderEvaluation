'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TenderFormData } from './CreateTenderWizard';

interface Step1Props {
  data: TenderFormData;
  onUpdate: (updates: Partial<TenderFormData>) => void;
}

const departments = [
  'Transportation',
  'Health',
  'IT',
  'Education',
  'Infrastructure',
  'Defense',
];

const categories = [
  'Goods & Services',
  'Construction',
  'Professional Services',
  'Equipment & Machinery',
  'Supplies & Consumables',
];

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
          <Select value={data.department} onValueChange={(value) => onUpdate({ department: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <Select value={data.category} onValueChange={(value) => onUpdate({ category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
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

      <div>
        <label className="block text-sm font-medium mb-2">Application Deadline *</label>
        <Input
          type="date"
          value={data.deadline.toISOString().split('T')[0]}
          onChange={(e) => onUpdate({ deadline: new Date(e.target.value) })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Budget Min (USD) *</label>
          <Input
            type="number"
            placeholder="0"
            value={data.budgetMin}
            onChange={(e) => onUpdate({ budgetMin: parseFloat(e.target.value) || 0 })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Budget Max (USD) *</label>
          <Input
            type="number"
            placeholder="0"
            value={data.budgetMax}
            onChange={(e) => onUpdate({ budgetMax: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
    </div>
  );
}
