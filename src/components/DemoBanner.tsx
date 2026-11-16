import { Info } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function DemoBanner() {
  const { demoMode } = useApp();
  if (!demoMode) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-veyra-200 bg-veyra-50 px-4 py-2.5 text-sm text-veyra-800">
      <Info size={16} className="shrink-0" />
      <span>
        <strong className="font-semibold">Demo Mode:</strong> Feedback is generated from a
        built-in evaluation engine, not a live AI model. Add an API key to enable AI-powered
        interviews.
      </span>
    </div>
  );
}
