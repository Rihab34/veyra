import { useMemo, useState } from 'react';
import {
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Globe,
  Heart,
  Link2,
  Loader2,
  Search,
  Trophy,
  X,
} from 'lucide-react';
import { INSTITUTIONS, searchInstitutions, type Institution, type InstitutionCategory } from '@/lib/institutions';

export interface LinkContent {
  title: string;
  context: string;
}

interface SourcePickerProps {
  initialTab: InstitutionCategory;
  selected: Institution | null;
  linkContent: LinkContent | null;
  customLink: string;
  linkFetching: boolean;
  linkError: string;
  onSelectInstitution: (institution: Institution) => void;
  onCustomLinkChange: (value: string) => void;
  onFetchLink: () => void;
  onClear: () => void;
}

const TABS: { value: InstitutionCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'university', label: 'Universities', icon: <GraduationCap size={15} /> },
  { value: 'scholarship', label: 'Scholarships', icon: <Award size={15} /> },
  { value: 'job', label: 'Jobs', icon: <Briefcase size={15} /> },
  { value: 'internship', label: 'Internships', icon: <Briefcase size={15} /> },
  { value: 'competition', label: 'Competitions', icon: <Trophy size={15} /> },
  { value: 'personal_intro', label: 'Personal Intro', icon: <Heart size={15} /> },
];

const DIRECTORY_LABELS: Record<InstitutionCategory, string> = {
  university: 'universities',
  scholarship: 'scholarships',
  job: 'companies',
  internship: 'internships',
  competition: 'competitions',
  personal_intro: 'resources',
};

export function SourcePicker({
  initialTab,
  selected,
  linkContent,
  customLink,
  linkFetching,
  linkError,
  onSelectInstitution,
  onCustomLinkChange,
  onFetchLink,
  onClear,
}: SourcePickerProps) {
  const [activeTab, setActiveTab] = useState<InstitutionCategory>(initialTab);
  const [search, setSearch] = useState('');
  const institutions = useMemo(() => searchInstitutions(search, activeTab), [search, activeTab]);
  const totalInTab = INSTITUTIONS.filter((i) => i.category === activeTab).length;
  const hasSource = Boolean(selected || linkContent);

  return (
    <div className="mt-5 space-y-4">
      {hasSource && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#ff6a2b]/30 bg-[#fff3ec] px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <CheckCircle2 size={18} className="shrink-0 text-[#c4501c]" />
            <p className="truncate text-sm font-semibold text-[#0e1217]">{selected?.name || linkContent?.title}</p>
          </div>
          <button
            onClick={onClear}
            aria-label="Remove source"
            className="shrink-0 rounded-full p-1.5 text-[#5e6670] transition-colors hover:bg-white hover:text-[#0e1217]"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all ${
              activeTab === tab.value
                ? 'border-[#0e1217] bg-[#0e1217] text-white'
                : 'border-[#0e1217]/10 bg-white text-[#0e1217] hover:border-[#0e1217]/25'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5e6670]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${DIRECTORY_LABELS[activeTab]} by name or country`}
          aria-label="Search directory"
          className="h-11 w-full rounded-xl border border-[#0e1217]/12 bg-white pl-10 pr-4 text-sm text-[#0e1217] placeholder:text-[#5e6670]/70 focus:border-[#ff6a2b] focus:outline-none focus:ring-2 focus:ring-[#ff6a2b]/20"
        />
      </div>

      <div className="max-h-56 space-y-1.5 overflow-y-auto rounded-2xl border border-[#0e1217]/8 bg-[#fbf6ee] p-2">
        {institutions.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#5e6670]">No results. Try a link below.</p>
        ) : (
          institutions.map((inst) => {
            const isSelected = selected?.id === inst.id;
            return (
              <button
                key={inst.id}
                onClick={() => onSelectInstitution(inst)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                  isSelected ? 'border-[#ff6a2b] bg-white' : 'border-transparent hover:bg-white'
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0e1217]/5 text-[#0e1217]">
                  <Building2 size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-[#0e1217]">{inst.name}</span>
                  <span className="block truncate text-xs text-[#5e6670]">{inst.country} · {inst.description}</span>
                </span>
                <a
                  href={inst.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 rounded-full p-1.5 text-[#5e6670] transition-colors hover:bg-white hover:text-[#0e1217]"
                  aria-label="Visit official page"
                >
                  <ExternalLink size={15} />
                </a>
              </button>
            );
          })
        )}
      </div>
      <p className="text-xs text-[#5e6670]">
        {totalInTab} {DIRECTORY_LABELS[activeTab]} available
      </p>

      <div className="border-t border-[#0e1217]/10 pt-4">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0e1217]">
          <Link2 size={15} className="text-[#ff6a2b]" /> Or paste any link
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Globe size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5e6670]" />
            <input
              type="url"
              value={customLink}
              onChange={(e) => onCustomLinkChange(e.target.value)}
              placeholder="https://example.edu/admissions"
              aria-label="Program or job link"
              disabled={linkFetching}
              className="h-11 w-full rounded-xl border border-[#0e1217]/12 bg-white pl-10 pr-4 text-sm text-[#0e1217] placeholder:text-[#5e6670]/70 focus:border-[#ff6a2b] focus:outline-none focus:ring-2 focus:ring-[#ff6a2b]/20"
            />
          </div>
          <button
            onClick={onFetchLink}
            disabled={!customLink.trim() || linkFetching}
            className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[#0e1217] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1b2129] disabled:opacity-50"
          >
            {linkFetching ? <Loader2 size={16} className="animate-spin" /> : <Link2 size={16} />}
            {linkFetching ? 'Reading' : 'Fetch'}
          </button>
        </div>
        {linkError && <p className="mt-2 text-xs text-red-700">{linkError}</p>}
      </div>
    </div>
  );
}
