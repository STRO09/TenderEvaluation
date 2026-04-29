interface ConfidenceIndicatorProps {
  score: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ConfidenceIndicator({
  score,
  label = 'Confidence',
  showPercentage = true,
  className,
}: ConfidenceIndicatorProps) {
  const percentage = Math.round(score * 100);
  const getColor = (score: number) => {
    if (score >= 0.8) return 'bg-status-eligible';
    if (score >= 0.6) return 'bg-status-review';
    return 'bg-status-rejected';
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        {showPercentage && <span className="text-sm font-semibold">{percentage}%</span>}
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor(score)} transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
