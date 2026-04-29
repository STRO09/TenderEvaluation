import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfidenceIndicator } from '@/components/common/ConfidenceIndicator';
import { CriteriaChecklistItem } from '@/components/common/CriteriaChecklistItem';
import { TimelineItem } from '@/components/common/TimelineItem';
import { DocumentCard } from '@/components/common/DocumentCard';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function CompanySubmissionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const submission = {
    id: params.id,
    tenderTitle: 'Infrastructure Development Project',
    status: 'eligible' as const,
    confidence: 0.92,
    submittedAt: new Date('2024-04-01'),
    evaluatedAt: new Date('2024-04-15'),
  };

  const documents = [
    {
      id: 'doc-1',
      name: 'GST_Certificate.pdf',
      fileSize: 245000,
      fileType: 'PDF',
      uploadedAt: new Date('2024-04-01'),
      processingState: 'processed' as const,
    },
    {
      id: 'doc-2',
      name: 'Balance_Sheet_2023.pdf',
      fileSize: 512000,
      fileType: 'PDF',
      uploadedAt: new Date('2024-04-01'),
      processingState: 'processed' as const,
    },
  ];

  const criteria = [
    { name: 'Minimum Annual Turnover', status: 'eligible' as const },
    { name: 'Valid GST Registration', status: 'eligible' as const },
    { name: 'No Prior Defaults', status: 'eligible' as const },
    { name: 'Construction Experience', status: 'review' as const },
  ];

  const timeline = [
    {
      title: 'Submission Received',
      timestamp: new Date('2024-04-01T10:30'),
      description: 'Your submission was received and queued for processing.',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      title: 'Documents Processing',
      timestamp: new Date('2024-04-01T11:15'),
      description: 'Documents are being extracted and analyzed.',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      title: 'Evaluation Started',
      timestamp: new Date('2024-04-05T09:00'),
      description: 'Government evaluator started reviewing your submission.',
      icon: <AlertCircle className="w-4 h-4" />,
    },
    {
      title: 'Evaluation Complete',
      timestamp: new Date('2024-04-15T14:22'),
      description: 'Your submission evaluation is complete.',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">{submission.tenderTitle}</h1>
        <p className="text-muted-foreground mt-2">Submission ID: {submission.id}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <div className="mt-2">
            <StatusBadge status={submission.status} />
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Confidence Score</p>
          <p className="text-2xl font-bold mt-2">{Math.round(submission.confidence * 100)}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Submitted On</p>
          <p className="text-lg font-semibold mt-2">
            {submission.submittedAt.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
          <p className="text-lg font-semibold mt-2">
            {submission.evaluatedAt.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </Card>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          <TabsTrigger value="flags">Issues</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Submitted Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  id={doc.id}
                  name={doc.name}
                  fileSize={doc.fileSize}
                  fileType={doc.fileType}
                  uploadedAt={doc.uploadedAt}
                  processingState={doc.processingState}
                  showActions={false}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluation">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Summary</CardTitle>
              <div className="mt-4">
                <ConfidenceIndicator score={submission.confidence} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {criteria.map((criterion, idx) => (
                <CriteriaChecklistItem
                  key={idx}
                  name={criterion.name}
                  status={criterion.status}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flags">
          <Card>
            <CardHeader>
              <CardTitle>Issues & Flags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>No critical issues found. All documents are in order.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Submission Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {timeline.map((item, idx) => (
                <TimelineItem
                  key={idx}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  timestamp={item.timestamp}
                  isLast={idx === timeline.length - 1}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
