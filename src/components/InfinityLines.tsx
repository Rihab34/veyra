interface InfinityLinesProps {
  className?: string;
}

export function InfinityLines({ className = '' }: InfinityLinesProps) {
  return (
    <div className={`infinity-lines ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 60" fill="none" className="infinity-lines-svg">
        <path
          className="infinity-line infinity-line-1"
          d="M 60,30 C 40,10 20,10 10,30 C 0,50 20,50 60,30 C 100,10 120,10 110,30 C 100,50 80,50 60,30"
        />
        <path
          className="infinity-line infinity-line-2"
          d="M 60,30 C 40,10 20,10 10,30 C 0,50 20,50 60,30 C 100,10 120,10 110,30 C 100,50 80,50 60,30"
        />
        <path
          className="infinity-line infinity-line-3"
          d="M 60,30 C 40,10 20,10 10,30 C 0,50 20,50 60,30 C 100,10 120,10 110,30 C 100,50 80,50 60,30"
        />
      </svg>
    </div>
  );
}
