'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { TenderFormData } from './CreateTenderWizard';
import { Plus, Trash2 } from 'lucide-react';

interface Step3Props {
  data: TenderFormData;
  onUpdate: (updates: Partial<TenderFormData>) => void;
}

const PRESET_DOCS = [
  { name: 'GST Certificate', validationType: 'registration' as const, verificationSource: 'GST_API' as const },
  { name: 'Company Incorporation Certificate', validationType: 'registration' as const, verificationSource: 'MCA_API' as const },
  { name: 'Audited Financial Statement', validationType: 'financial' as const, verificationSource: 'manual' as const },
  { name: 'PAN Card', validationType: 'identity' as const, verificationSource: 'manual' as const },
  { name: 'ISO Certificate', validationType: 'technical' as const, verificationSource: 'manual' as const },
];

export function Step3RequiredDocuments({ data, onUpdate }: Step3Props) {
  const handleAdd = () => {
    onUpdate({
      requiredDocuments: [
        ...data.requiredDocuments,
        { id: Date.now().toString(), name: '', mandatory: false, validationType: 'other', verificationSource: 'manual', description: '' },
      ],
    });
  };

  const handleAddPreset = (preset: typeof PRESET_DOCS[0]) => {
    onUpdate({
      requiredDocuments: [
        ...data.requiredDocuments,
        { id: Date.now().toString(), ...preset, mandatory: true, description: '' },
      ],
    });
  };

  const handleDelete = (id: string) => {
    onUpdate({ requiredDocuments: data.requiredDocuments.filter((d) => d.id !== id) });
  };

  const handleUpdate = (id: string, updates: Partial<TenderFormData['requiredDocuments'][0]>) => {
    onUpdate({
      requiredDocuments: data.requiredDocuments.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Specify which documents bidders must submit. The verification source tells the system how to validate each one automatically.
      </p>

      {/* Quick-add presets */}
      {data.requiredDocuments.length === 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Quick add common documents:</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_DOCS.map((p) => (
              <button
                key={p.name}
                onClick={() => handleAddPreset(p)}
                className="text-xs border border-dashed rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                + {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {data.requiredDocuments.map((doc, idx) => (
          <div key={doc.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Document {idx + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Document Name *</label>
                <Input
                  placeholder="e.g., GST Certificate"
                  value={doc.name}
                  onChange={(e) => handleUpdate(doc.id, { name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Validation Type *</label>
                <Select
                  value={doc.validationType}
                  onValueChange={(v) =>
                    handleUpdate(doc.id, { validationType: v as TenderFormData['requiredDocuments'][0]['validationType'] })
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="registration">Registration</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="identity">Identity</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Verification Source</label>
                <Select
                  value={doc.verificationSource}
                  onValueChange={(v) =>
                    handleUpdate(doc.id, { verificationSource: v as TenderFormData['requiredDocuments'][0]['verificationSource'] })
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GST_API">GST API (auto)</SelectItem>
                    <SelectItem value="MCA_API">MCA API (auto)</SelectItem>
                    <SelectItem value="manual">Manual review</SelectItem>
                    <SelectItem value="none">No verification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={doc.mandatory}
                    onCheckedChange={(checked) => handleUpdate(doc.id, { mandatory: !!checked })}
                  />
                  <span className="text-sm font-medium">Mandatory</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description / Guidelines</label>
              <Textarea
                placeholder="Specific requirements for this document..."
                value={doc.description || ''}
                onChange={(e) => handleUpdate(doc.id, { description: e.target.value })}
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>

      <Button onClick={handleAdd} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Document Type
      </Button>
    </div>
  );
}