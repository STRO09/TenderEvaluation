import { cn } from '@/lib/utils';

export type StatusType = 'eligible' | 'rejected' | 'review' | 'processing';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const statusConfig = {
  eligible: {
    bg: 'bg-status-eligible-bg',
    text: 'text-status-eligible',
    label: 'Eligible',
  },
  rejected: {
    bg: 'bg-status-rejected-bg',
    text: 'text-status-rejected',
    label: 'Rejected',
  },
  review: {
    bg: 'bg-status-review-bg',
    text: 'text-status-review',
    label: 'Needs Review',
  },
  processing: {
    bg: 'bg-status-processing-bg',
    text: 'text-status-processing',
    label: 'Processing',
  },
};

export function StatusBadge({
  status,
  label,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.bg,
        config.text,
        className
      )}
    >
      {label || config.label}
    </span>
  );
}
