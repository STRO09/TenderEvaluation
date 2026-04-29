import { TimelineItem } from './TimelineItem';
import { DocumentCard, DocumentProcessingState } from './DocumentCard';

export interface DocumentVersion {
  id: string;
  name: string;
  uploadedAt: Date;
  fileSize: number;
  fileType: string;
  processingState: DocumentProcessingState;
  isLatest?: boolean;
}

interface DocumentVersionHistoryProps {
  versions: DocumentVersion[];
  onDownload?: (versionId: string) => void;
  onDelete?: (versionId: string) => void;
  onRetry?: (versionId: string) => void;
}

export function DocumentVersionHistory({
  versions,
  onDownload,
  onDelete,
  onRetry,
}: DocumentVersionHistoryProps) {
  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedVersions.map((version, index) => (
        <div key={version.id} className="space-y-2">
          {index > 0 && <div className="h-px bg-border my-4" />}
          <div className="flex items-center gap-2">
            {version.isLatest && (
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-status-eligible-bg text-status-eligible">
                Current
              </span>
            )}
          </div>
          <DocumentCard
            id={version.id}
            name={version.name}
            fileSize={version.fileSize}
            fileType={version.fileType}
            uploadedAt={version.uploadedAt}
            processingState={version.processingState}
            onDownload={() => onDownload?.(version.id)}
            onDelete={() => onDelete?.(version.id)}
            onRetry={() => onRetry?.(version.id)}
            showActions={true}
          />
        </div>
      ))}
    </div>
  );
}
