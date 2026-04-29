import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TimelineItemProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  timestamp?: Date;
  isLast?: boolean;
  className?: string;
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TimelineItem({
  icon,
  title,
  description,
  timestamp,
  isLast = false,
  className,
}: TimelineItemProps) {
  return (
    <div className={cn('flex gap-4', className)}>
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted border-2 border-border">
          {icon && <span className="text-muted-foreground">{icon}</span>}
        </div>
        {!isLast && <div className="w-0.5 h-12 bg-border mt-2" />}
      </div>

      <div className="flex-grow pb-8">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="font-medium">{title}</h4>
          {timestamp && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatTime(timestamp)}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
