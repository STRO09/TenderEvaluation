'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { TenderFormData } from './CreateTenderWizard';

interface Step4Props {
  data: TenderFormData;
  onUpdate: (updates: Partial<TenderFormData>) => void;
}

export function Step4EvaluationSettings({ data, onUpdate }: Step4Props) {
  const accept = Math.round(data.confidenceThresholds.autoAccept * 100);
  const review = Math.round(data.confidenceThresholds.needsReview * 100);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold mb-4">Decision Rules</h3>
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Evaluation Mode</label>
            <Select
              value={data.evaluationRules.evaluationMode}
              onValueChange={(v) =>
                onUpdate({ evaluationRules: { ...data.evaluationRules, evaluationMode: v as 'strict' | 'confidence_based' } })
              }
            >
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confidence_based">Confidence-based (AI scored)</SelectItem>
                <SelectItem value="strict">Strict (all criteria binary pass/fail)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={data.evaluationRules.allMandatoryMustPass}
              onCheckedChange={(checked) =>
                onUpdate({ evaluationRules: { ...data.evaluationRules, allMandatoryMustPass: !!checked } })
              }
            />
            <div>
              <p className="font-medium text-sm">All mandatory criteria must pass</p>
              <p className="text-sm text-muted-foreground">
                A submission can only be eligible if every mandatory criterion is met.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={data.evaluationRules.manualOverrideAllowed}
              onCheckedChange={(checked) =>
                onUpdate({ evaluationRules: { ...data.evaluationRules, manualOverrideAllowed: !!checked } })
              }
            />
            <div>
              <p className="font-medium text-sm">Allow manual override</p>
              <p className="text-sm text-muted-foreground">
                Officers can override AI decisions with a recorded justification.
              </p>
            </div>
          </label>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Confidence Thresholds</h3>
        <div className="space-y-6 p-4 border rounded-lg">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Auto-Accept Threshold</label>
              <span className="text-sm font-semibold text-green-600">{accept}%</span>
            </div>
            <input
              type="range" min="0" max="100" step="5"
              value={accept}
              onChange={(e) => onUpdate({ confidenceThresholds: { ...data.confidenceThresholds, autoAccept: parseInt(e.target.value) / 100 } })}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Submissions scoring above this are automatically marked eligible.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Needs-Review Threshold</label>
              <span className="text-sm font-semibold text-amber-600">{review}%</span>
            </div>
            <input
              type="range" min="0" max="100" step="5"
              value={review}
              onChange={(e) => onUpdate({ confidenceThresholds: { ...data.confidenceThresholds, needsReview: parseInt(e.target.value) / 100 } })}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Submissions scoring below this are flagged for manual review.
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg space-y-1.5 text-xs text-muted-foreground">
          <p className="font-medium text-foreground text-sm mb-2">Threshold logic</p>
          <p>• Score ≥ {accept}% → Auto-eligible</p>
          <p>• Score {review}%–{accept - 1}% → Needs manual review</p>
          <p>• Score &lt; {review}% → Auto-rejected</p>
        </div>
      </div>
    </div>
  );
}