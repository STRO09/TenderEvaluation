'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface FilterConfig {
  id: string;
  label: string;
  type: 'text' | 'select' | 'checkbox';
  options?: Array<{ value: string; label: string }>;
}

interface FilterPanelProps {
  filters: FilterConfig[];
  onApply: (values: Record<string, string | string[]>) => void;
  onReset: () => void;
}

export function FilterPanel({ filters, onApply, onReset }: FilterPanelProps) {
  const [values, setValues] = useState<Record<string, string | string[]>>({});

  const handleChange = (filterId: string, value: string | string[]) => {
    setValues((prev) => ({ ...prev, [filterId]: value }));
  };

  const handleApply = () => {
    onApply(values);
  };

  const handleReset = () => {
    setValues({});
    onReset();
  };

  const hasActiveFilters = Object.values(values).some((v) => v);

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      {filters.map((filter) => (
        <div key={filter.id} className="space-y-2">
          <label className="text-sm font-medium">{filter.label}</label>
          {filter.type === 'text' && (
            <Input
              placeholder={`Filter by ${filter.label.toLowerCase()}`}
              value={(values[filter.id] as string) || ''}
              onChange={(e) => handleChange(filter.id, e.target.value)}
            />
          )}
          {filter.type === 'select' && (
            <Select
              value={(values[filter.id] as string) || ''}
              onValueChange={(value) => handleChange(filter.id, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {filter.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {filter.type === 'checkbox' && (
            <div className="space-y-2">
              {filter.options?.map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={
                      Array.isArray(values[filter.id])
                        ? (values[filter.id] as string[]).includes(option.value)
                        : false
                    }
                    onCheckedChange={(checked) => {
                      const current = Array.isArray(values[filter.id])
                        ? (values[filter.id] as string[])
                        : [];
                      const updated = checked
                        ? [...current, option.value]
                        : current.filter((v) => v !== option.value);
                      handleChange(filter.id, updated);
                    }}
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-2 pt-2">
        <Button onClick={handleApply} className="flex-1">
          Apply Filters
        </Button>
        {hasActiveFilters && (
          <Button
            onClick={handleReset}
            variant="outline"
            size="icon"
            title="Clear filters"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
