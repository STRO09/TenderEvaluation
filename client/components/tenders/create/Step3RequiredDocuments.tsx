'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { TenderFormData } from './CreateTenderWizard';
import { Plus, Trash2 } from 'lucide-react';

interface Step3Props {
  data: TenderFormData;
  onUpdate: (updates: Partial<TenderFormData>) => void;
}

export function Step3RequiredDocuments({ data, onUpdate }: Step3Props) {
  const handleAddDocument = () => {
    const newDocument = {
      id: Date.now().toString(),
      name: '',
      mandatory: false,
      description: '',
    };
    onUpdate({
      requiredDocuments: [...data.requiredDocuments, newDocument],
    });
  };

  const handleDeleteDocument = (id: string) => {
    onUpdate({
      requiredDocuments: data.requiredDocuments.filter((d) => d.id !== id),
    });
  };

  const handleUpdateDocument = (id: string, updates: any) => {
    onUpdate({
      requiredDocuments: data.requiredDocuments.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <p>List all document types required for this tender. Specify which are mandatory.</p>
      </div>

      <div className="space-y-4">
        {data.requiredDocuments.map((doc) => (
          <div key={doc.id} className="p-4 border rounded-lg space-y-4">
            <div className="grid grid-cols-3 gap-4 items-start">
              <div>
                <label className="block text-sm font-medium mb-2">Document Name *</label>
                <Input
                  placeholder="e.g., GST Certificate"
                  value={doc.name}
                  onChange={(e) =>
                    handleUpdateDocument(doc.id, { name: e.target.value })
                  }
                />
              </div>

              <div className="flex items-end gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={doc.mandatory}
                    onCheckedChange={(checked) =>
                      handleUpdateDocument(doc.id, { mandatory: checked })
                    }
                  />
                  <span className="text-sm font-medium">Mandatory</span>
                </label>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteDocument(doc.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                placeholder="Add guidelines or specific requirements for this document"
                value={doc.description || ''}
                onChange={(e) =>
                  handleUpdateDocument(doc.id, { description: e.target.value })
                }
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>

      <Button onClick={handleAddDocument} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Document Type
      </Button>
    </div>
  );
}
