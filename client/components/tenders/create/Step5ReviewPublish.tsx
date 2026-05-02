'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { isFormValid } from './CreateTenderWizard';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { CreateTenderPayload } from '@/lib/types/Tender';

interface Step5Props { data: CreateTenderPayload; }

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 text-sm border-b last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right max-w-[60%]">{value || '—'}</span>
    </div>
  );
}

export function Step5ReviewPublish({ data }: Step5Props) {
  const valid = isFormValid(data);

  const errors: string[] = [];
  if (!data.title) errors.push('Tender title is required');
  if (!data.department) errors.push('Department is required');
  if (!data.description) errors.push('Description is required');
  if (!data.submissionStartDate || !data.submissionDeadline) errors.push('Submission window dates are required');
  if (!data.budgetMin || !data.budgetMax) errors.push('Budget range is required');
  if (data.budgetMax < data.budgetMin) errors.push('Budget max must be ≥ min');
  if (data.eligibilityCriteria.length === 0) errors.push('At least one eligibility criterion is required');
  if (data.requiredDocuments.length === 0) errors.push('At least one required document is required');

  return (
    <div className="space-y-6">
      {!valid ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Some required fields are missing</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1">
              {errors.map((e, i) => <li key={i} className="text-sm">• {e}</li>)}
            </ul>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-green-300 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-700">Ready to publish</AlertTitle>
          <AlertDescription className="text-green-600">
            All required fields are complete.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Tender information</CardTitle></CardHeader>
          <CardContent>
            <Row label="Title" value={data.title} />
            <Row label="Department" value={data.department} />
            <Row label="Category" value={data.category} />
            <Row label="Submission opens" value={data.submissionStartDate?.toLocaleDateString() ?? ''} />
            <Row label="Deadline" value={data.submissionDeadline?.toLocaleDateString() ?? ''} />
            <Row label="Budget range" value={data.budgetMin && data.budgetMax ? `₹${data.budgetMin.toLocaleString()} – ₹${data.budgetMax.toLocaleString()}` : ''} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Evaluation settings</CardTitle></CardHeader>
          <CardContent>
            <Row label="Mode" value={data.evaluationRules.evaluationMode === 'confidence_based' ? 'Confidence-based' : 'Strict'} />
            <Row label="Mandatory criteria" value={data.evaluationRules.allMandatoryMustPass ? 'All must pass' : 'Optional'} />
            <Row label="Manual override" value={data.evaluationRules.manualOverrideAllowed ? 'Allowed' : 'Disabled'} />
            <Row label="Auto-accept threshold" value={`${Math.round(data.confidenceThresholds.autoAccept * 100)}%`} />
            <Row label="Needs-review threshold" value={`${Math.round(data.confidenceThresholds.needsReview * 100)}%`} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Eligibility criteria ({data.eligibilityCriteria.length})</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {data.eligibilityCriteria.map((c) => (
              <li key={c.id} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                <span>{c.name || c.field}</span>
                {c.condition && c.value && <span className="text-muted-foreground">{c.condition} {c.value} {c.unit}</span>}
                {c.mandatory && <span className="text-xs font-semibold text-destructive">(Mandatory)</span>}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Required documents ({data.requiredDocuments.length})</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {data.requiredDocuments.map((d) => (
              <li key={d.id} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                <span>{d.name}</span>
                <span className="text-muted-foreground text-xs">({d.verificationSource})</span>
                {d.mandatory && <span className="text-xs font-semibold text-destructive">(Mandatory)</span>}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
        Once published, this tender is visible to all registered companies. Published tenders are locked from editing.
      </div>
    </div>
  );
}