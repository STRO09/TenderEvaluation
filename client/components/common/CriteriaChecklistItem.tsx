import { Check, X, AlertCircle } from 'lucide-react';
import { StatusType } from './StatusBadge';
import { cn } from '@/lib/utils';

interface CriteriaChecklistItemProps {
  name: string;
  status: StatusType;
  explanation?: string;
  mandatory?: boolean;
  className?: string;
}

export function CriteriaChecklistItem({
  name,
  status,
  explanation,
  mandatory = false,
  className,
}: CriteriaChecklistItemProps) {
  const getIcon = () => {
    switch (status) {
      case 'eligible':
        return <Check className="w-5 h-5 text-status-eligible" />;
      case 'rejected':
        return <X className="w-5 h-5 text-status-rejected" />;
      case 'review':
        return <AlertCircle className="w-5 h-5 text-status-review" />;
      case 'processing':
        return <AlertCircle className="w-5 h-5 text-status-processing" />;
    }
  };

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg border',
        status === 'eligible' && 'border-status-eligible bg-status-eligible-bg/30',
        status === 'rejected' && 'border-status-rejected bg-status-rejected-bg/30',
        status === 'review' && 'border-status-review bg-status-review-bg/30',
        status === 'processing' && 'border-status-processing bg-status-processing-bg/30',
        className
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <p className="font-medium">{name}</p>
          {mandatory && <span className="text-xs font-semibold text-red-600">Required</span>}
        </div>
        {explanation && <p className="text-sm text-muted-foreground mt-1">{explanation}</p>}
      </div>
    </div>
  );
}
