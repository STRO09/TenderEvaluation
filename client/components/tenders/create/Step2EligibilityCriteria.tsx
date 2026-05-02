'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { CreateTenderPayload } from '@/lib/types/Tender';
import { Plus, Trash2 } from 'lucide-react';

type EligibilityCriterion = CreateTenderPayload['eligibilityCriteria'][0];

interface Step2Props {
  data: CreateTenderPayload;
  onUpdate: (updates: Partial<CreateTenderPayload>) => void;
}

const FIELDS: { value: EligibilityCriterion['field']; label: string; unit: string; type: EligibilityCriterion['type'] }[] = [
  { value: 'annualTurnover',  label: 'Annual Turnover',          unit: 'INR',   type: 'numeric'  },
  { value: 'experienceYears', label: 'Years of Experience',      unit: 'years', type: 'numeric'  },
  { value: 'netWorth',        label: 'Net Worth',                unit: 'INR',   type: 'numeric'  },
  { value: 'employeeCount',   label: 'Employee Count',           unit: 'count', type: 'numeric'  },
  { value: 'gstValid',        label: 'GST Registration Valid',   unit: '',      type: 'boolean'  },
  { value: 'isoRegistered',   label: 'ISO Registered',           unit: '',      type: 'boolean'  },
  { value: 'blacklistFree',   label: 'Blacklist Free',           unit: '',      type: 'boolean'  },
  { value: 'custom',          label: 'Custom field',             unit: '',      type: 'numeric'  },
];

const CONDITIONS = [
  { value: '>',  label: 'Greater than (>)'    },
  { value: '>=', label: 'Greater or equal (>=)' },
  { value: '<',  label: 'Less than (<)'       },
  { value: '<=', label: 'Less or equal (<=)'  },
  { value: '=',  label: 'Equal (=)'           },
];

const empty = (): EligibilityCriterion => ({
  id:        Date.now().toString(),
  name:      '',
  field:     '',
  unit:      '',
  type:      'numeric',
  condition: '>=',
  value:     '',
  mandatory: false,
});

export function Step2EligibilityCriteria({ data, onUpdate }: Step2Props) {
  const update = (id: string, updates: Partial<EligibilityCriterion>) =>
    onUpdate({
      eligibilityCriteria: data.eligibilityCriteria.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    });

  const onFieldChange = (id: string, fieldValue: string) => {
    const def = FIELDS.find((f) => f.value === fieldValue);
    update(id, {
      field:     fieldValue,
      unit:      def?.unit  ?? '',
      type:      def?.type  ?? 'numeric',
      // auto-fill name unless it's a custom field
      name:      def?.value !== 'custom' ? (def?.label ?? '') : '',
      // reset condition + value when switching field
      condition: '>=',
      value:     '',
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Define the eligibility rules bidders must meet. Each criterion maps a measurable
        field to a threshold — this is what the AI uses to evaluate submissions.
      </p>

      <div className="space-y-4">
        {data.eligibilityCriteria.map((c, idx) => (
          <div key={c.id} className="p-4 border rounded-lg space-y-4">

            {/* Header row */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">
                Criterion {idx + 1}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onUpdate({ eligibilityCriteria: data.eligibilityCriteria.filter((x) => x.id !== c.id) })
                }
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>

            {/* Field selector + display name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Field *</label>
                <Select value={c.field} onValueChange={(v) => onFieldChange(c.id, v)}>
                  <SelectTrigger><SelectValue placeholder="Select field" /></SelectTrigger>
                  <SelectContent>
                    {FIELDS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Display Name *</label>
                <Input
                  placeholder="e.g., Minimum Annual Turnover"
                  value={c.name}
                  onChange={(e) => update(c.id, { name: e.target.value })}
                />
              </div>
            </div>

            {/* Numeric: condition + value + unit */}
            {c.type === 'numeric' && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Condition *</label>
                  <Select value={c.condition} onValueChange={(v) => update(c.id, { condition: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CONDITIONS.map((cd) => (
                        <SelectItem key={cd.value} value={cd.value}>{cd.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Value *</label>
                  <Input
                    type="number"
                    placeholder="e.g., 1000000"
                    value={c.value}
                    onChange={(e) => update(c.id, { value: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Unit</label>
                  <Input
                    value={c.unit}
                    placeholder="INR / years / …"
                    onChange={(e) => update(c.id, { unit: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Boolean: just a note, no value needed */}
            {c.type === 'boolean' && (
              <p className="text-sm text-muted-foreground bg-muted rounded px-3 py-2">
                Yes / No criterion — bidder must confirm compliance. No threshold needed.
              </p>
            )}

            {/* Document: description of what to look for */}
            {c.type === 'document' && (
              <div>
                <label className="block text-sm font-medium mb-2">Expected value / keyword</label>
                <Input
                  placeholder="e.g., valid, certified, registered"
                  value={c.value}
                  onChange={(e) => update(c.id, { value: e.target.value })}
                />
              </div>
            )}

            {/* Mandatory toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={c.mandatory}
                onCheckedChange={(checked) => update(c.id, { mandatory: !!checked })}
              />
              <span className="text-sm font-medium">Mandatory</span>
            </label>
          </div>
        ))}
      </div>

      <Button
        onClick={() => onUpdate({ eligibilityCriteria: [...data.eligibilityCriteria, empty()] })}
        variant="outline"
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Eligibility Criterion
      </Button>
    </div>
  );
}