import { File, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentProcessingBadge } from './DocumentProcessingBadge';
import { cn } from '@/lib/utils';

export type DocumentProcessingState = 'uploading' | 'processing' | 'processed' | 'failed';

interface DocumentCardProps {
  id: string;
  name: string;
  fileSize: number;
  fileType: string;
  uploadedAt: Date;
  processingState: DocumentProcessingState;
  onDownload?: () => void;
  onDelete?: () => void;
  onRetry?: () => void;
  showActions?: boolean;
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function DocumentCard({
  id,
  name,
  fileSize,
  fileType,
  uploadedAt,
  processingState,
  onDownload,
  onDelete,
  onRetry,
  showActions = true,
  className,
}: DocumentCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors',
        className
      )}
    >
      <div className="flex-shrink-0">
        <File className="w-8 h-8 text-muted-foreground" />
      </div>

      <div className="flex-grow min-w-0">
        <h3 className="font-medium truncate">{name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{fileType}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{formatDate(uploadedAt)}</span>
        </div>
        <div className="mt-2">
          <DocumentProcessingBadge state={processingState} />
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2 flex-shrink-0">
          {processingState === 'failed' && onRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRetry}
              title="Retry upload"
            >
              Retry
            </Button>
          )}
          {processingState === 'processed' && onDownload && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onDownload}
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              title="Delete file"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
