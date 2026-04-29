import { Check, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DocumentProcessingState = 'uploading' | 'processing' | 'processed' | 'failed';

interface DocumentProcessingBadgeProps {
  state: DocumentProcessingState;
  className?: string;
}

const stateConfig = {
  uploading: {
    icon: Clock,
    label: 'Uploading...',
    bg: 'bg-muted',
    text: 'text-muted-foreground',
  },
  processing: {
    icon: Clock,
    label: 'Processing (extracting data...)',
    bg: 'bg-status-processing-bg',
    text: 'text-status-processing',
  },
  processed: {
    icon: Check,
    label: 'Processed',
    bg: 'bg-status-eligible-bg',
    text: 'text-status-eligible',
  },
  failed: {
    icon: AlertCircle,
    label: 'Failed',
    bg: 'bg-status-rejected-bg',
    text: 'text-status-rejected',
  },
};

export function DocumentProcessingBadge({
  state,
  className,
}: DocumentProcessingBadgeProps) {
  const config = stateConfig[state];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium',
        config.bg,
        config.text,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </div>
  );
}
