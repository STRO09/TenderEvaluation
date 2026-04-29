'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TenderFormData } from './CreateTenderWizard';
import { Plus, Trash2 } from 'lucide-react';

interface Step2Props {
  data: TenderFormData;
  onUpdate: (updates: Partial<TenderFormData>) => void;
}

export function Step2EligibilityCriteria({ data, onUpdate }: Step2Props) {
  const handleAddCriterion = () => {
    const newCriterion = {
      id: Date.now().toString(),
      name: '',
      type: 'numeric' as const,
      condition: '>=',
      value: '',
      mandatory: false,
    };
    onUpdate({
      eligibilityCriteria: [...data.eligibilityCriteria, newCriterion],
    });
  };

  const handleDeleteCriterion = (id: string) => {
    onUpdate({
      eligibilityCriteria: data.eligibilityCriteria.filter((c) => c.id !== id),
    });
  };

  const handleUpdateCriterion = (id: string, updates: any) => {
    onUpdate({
      eligibilityCriteria: data.eligibilityCriteria.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <p>Define the eligibility criteria that bidders must meet. Use the criteria builder below.</p>
      </div>

      <div className="space-y-4">
        {data.eligibilityCriteria.map((criterion) => (
          <div key={criterion.id} className="p-4 border rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Criterion Name *</label>
                <Input
                  placeholder="e.g., Minimum Annual Turnover"
                  value={criterion.name}
                  onChange={(e) =>
                    handleUpdateCriterion(criterion.id, { name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <Select
                  value={criterion.type}
                  onValueChange={(value) =>
                    handleUpdateCriterion(criterion.id, { type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="numeric">Numeric</SelectItem>
                    <SelectItem value="boolean">Boolean (Yes/No)</SelectItem>
                    <SelectItem value="document">Document-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Condition *</label>
                <Select
                  value={criterion.condition}
                  onValueChange={(value) =>
                    handleUpdateCriterion(criterion.id, { condition: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=">">Greater than (&gt;)</SelectItem>
                    <SelectItem value=">=">Greater or equal (&gt;=)</SelectItem>
                    <SelectItem value="<">Less than (&lt;)</SelectItem>
                    <SelectItem value="<=">Less or equal (&lt;=)</SelectItem>
                    <SelectItem value="=">Equal (=)</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Value *</label>
                <Input
                  placeholder="e.g., 100000"
                  value={criterion.value}
                  onChange={(e) =>
                    handleUpdateCriterion(criterion.id, { value: e.target.value })
                  }
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={criterion.mandatory}
                    onCheckedChange={(checked) =>
                      handleUpdateCriterion(criterion.id, { mandatory: checked })
                    }
                  />
                  <span className="text-sm font-medium">Mandatory</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteCriterion(criterion.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={handleAddCriterion} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Eligibility Criterion
      </Button>
    </div>
  );
}
