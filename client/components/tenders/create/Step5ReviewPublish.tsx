'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TenderFormData } from './CreateTenderWizard';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface Step5Props {
  data: TenderFormData;
}

export function Step5ReviewPublish({ data }: Step5Props) {
  const errors: string[] = [];

  if (!data.title) errors.push('Tender title is required');
  if (!data.department) errors.push('Department is required');
  if (!data.description) errors.push('Description is required');
  if (data.budgetMin <= 0 || data.budgetMax <= 0)
    errors.push('Budget range is required');
  if (data.budgetMax < data.budgetMin) errors.push('Max budget must be >= min budget');
  if (data.eligibilityCriteria.length === 0) errors.push('At least one eligibility criterion is required');
  if (data.requiredDocuments.length === 0) errors.push('At least one required document is required');

  const isValid = errors.length === 0;

  return (
    <div className="space-y-6">
      {!isValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Validation Errors</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1">
              {errors.map((error, idx) => (
                <li key={idx} className="text-sm">
                  • {error}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {isValid && (
        <Alert className="border-status-eligible bg-status-eligible-bg/30">
          <CheckCircle2 className="h-4 w-4 text-status-eligible" />
          <AlertTitle className="text-status-eligible">Ready to Publish</AlertTitle>
          <AlertDescription className="text-status-eligible/80">
            All required fields are complete. You can now publish this tender.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tender Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-muted-foreground">Title</p>
              <p>{data.title || '—'}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Department</p>
              <p>{data.department || '—'}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Category</p>
              <p>{data.category || '—'}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Deadline</p>
              <p>{data.deadline?.toLocaleDateString() || '—'}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Budget Range</p>
              <p>
                ${data.budgetMin?.toLocaleString()} - ${data.budgetMax?.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evaluation Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-muted-foreground">Mandatory Criteria</p>
              <p>
                {data.evaluationRules.allMandatoryMustPass
                  ? 'All must pass'
                  : 'Optional rule'}
              </p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Auto-Accept Threshold</p>
              <p>{Math.round(data.confidenceThresholds.autoAccept * 100)}%</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Needs Review Threshold</p>
              <p>{Math.round(data.confidenceThresholds.needsReview * 100)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Eligibility Criteria ({data.eligibilityCriteria.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {data.eligibilityCriteria.map((criterion) => (
              <li key={criterion.id} className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                <span>{criterion.name}</span>
                {criterion.mandatory && (
                  <span className="text-xs font-semibold text-destructive">
                    (Mandatory)
                  </span>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Required Documents ({data.requiredDocuments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {data.requiredDocuments.map((doc) => (
              <li key={doc.id} className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                <span>{doc.name}</span>
                {doc.mandatory && (
                  <span className="text-xs font-semibold text-destructive">
                    (Mandatory)
                  </span>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Once published, this tender will become visible to companies. You can edit draft
          tenders anytime, but published tenders are locked to prevent changes.
        </p>
      </div>
    </div>
  );
}
