'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { TenderFormData } from './CreateTenderWizard';

interface Step4Props {
  data: TenderFormData;
  onUpdate: (updates: Partial<TenderFormData>) => void;
}

export function Step4EvaluationSettings({ data, onUpdate }: Step4Props) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold mb-4">Decision Rules</h3>
        <div className="space-y-4 p-4 border rounded-lg">
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={data.evaluationRules.allMandatoryMustPass}
              onCheckedChange={(checked) =>
                onUpdate({
                  evaluationRules: {
                    ...data.evaluationRules,
                    allMandatoryMustPass: !!checked,
                  },
                })
              }
            />
            <div>
              <p className="font-medium">All mandatory criteria must pass</p>
              <p className="text-sm text-muted-foreground">
                A submission can only be marked eligible if all mandatory eligibility criteria are met.
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
              <span className="text-sm font-semibold text-status-eligible">
                {Math.round(data.confidenceThresholds.autoAccept * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={Math.round(data.confidenceThresholds.autoAccept * 100)}
              onChange={(e) =>
                onUpdate({
                  confidenceThresholds: {
                    ...data.confidenceThresholds,
                    autoAccept: parseInt(e.target.value) / 100,
                  },
                })
              }
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Submissions with confidence scores above this threshold will be automatically marked as eligible (if all mandatory criteria pass).
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Needs Review Threshold</label>
              <span className="text-sm font-semibold text-status-review">
                {Math.round(data.confidenceThresholds.needsReview * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={Math.round(data.confidenceThresholds.needsReview * 100)}
              onChange={(e) =>
                onUpdate({
                  confidenceThresholds: {
                    ...data.confidenceThresholds,
                    needsReview: parseInt(e.target.value) / 100,
                  },
                })
              }
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Submissions with confidence scores below this threshold will be flagged for manual review.
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
          <p className="text-sm font-medium">Threshold Logic:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>
              • Score &gt;= {Math.round(data.confidenceThresholds.autoAccept * 100)}%: Auto-eligible
            </li>
            <li>
              • Score {Math.round(data.confidenceThresholds.needsReview * 100)}% -{' '}
              {Math.round((data.confidenceThresholds.autoAccept - 0.01) * 100)}%: Needs review
            </li>
            <li>• Score &lt; {Math.round(data.confidenceThresholds.needsReview * 100)}%: Auto-rejected</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
