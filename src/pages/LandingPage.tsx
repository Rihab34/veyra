import {
  ArrowRight,
  Check,
  Compass,
  LayoutDashboard,
  Menu,
  Mic,
  Target,
  TrendingUp,
  UserPlus,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/components/Logo';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';

const steps = [
  { number: '01', id: 'step1', icon: UserPlus },
  { number: '02', id: 'step2', icon: Compass },
  { number: '03', id: 'step3', icon: LayoutDashboard },
  { number: '04', id: 'step4', icon: Target },
  { number: '05', id: 'step5', icon: Mic, dark: true },
  { number: '06', id: 'step6', icon: TrendingUp },
];

export function LandingPage() {
  const { navigate, profile, session, guest, signOut, language } = useApp();
  const signedIn = Boolean(session) || guest;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const tr = (key: string) => t(language, key);
  const startPath = profile ? '/dashboard' : '/onboarding';
  const startAction = () => navigate(signedIn ? startPath : '/auth/signup');
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen text-[#0e1217]">
      <nav className="sticky top-4 z-30 mx-auto flex max-w-[1200px] items-center justify-between rounded-xl border border-white/30 bg-white/15 px-4 py-3 backdrop-blur-md sm:px-6">
        <button onClick={() => navigate('/')} aria-label={tr('landing.nav.home')}><Logo size="sm" /></button>
        <div className="hidden items-center gap-7 text-xs font-medium text-[#5e6670] md:flex">
          <button onClick={() => scrollTo('method')} className="transition-colors hover:text-[#0e1217]">{tr('landing.nav.product')}</button>
          <button onClick={() => scrollTo('steps')} className="transition-colors hover:text-[#0e1217]">{tr('landing.nav.howItWorks')}</button>
          <button onClick={() => scrollTo('experience')} className="transition-colors hover:text-[#0e1217]">{tr('landing.nav.forStudents')}</button>
          
          {signedIn ? (
            <><button onClick={() => navigate(startPath)} className="font-semibold text-[#0e1217]">{tr('landing.nav.dashboard')}</button><button onClick={() => signOut()} className="rounded-lg bg-[#0e1217] px-4 py-2.5 font-semibold text-white">{tr('landing.nav.signOut')}</button></>
          ) : (
            <><button onClick={() => navigate('/auth/signin')} className="font-semibold text-[#0e1217]">{tr('landing.nav.logIn')}</button><button onClick={startAction} className="flex items-center gap-2 rounded-lg bg-[#0e1217] px-4 py-2.5 font-semibold text-white transition-transform hover:-translate-y-0.5">{tr('landing.nav.getStarted')} <ArrowRight size={14} /></button></>
          )}
        </div>
        <button className="rounded-lg p-2 md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={tr('landing.nav.menu')}>{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </nav>
      {mobileMenuOpen && <div className="fixed inset-x-4 top-20 z-20 rounded-xl border border-[#0e1217]/10 bg-[#fbf6ee] p-5 shadow-xl md:hidden"><div className="flex flex-col gap-4 text-sm"><button onClick={() => scrollTo('method')} className="text-left">{tr('landing.nav.product')}</button><button onClick={() => scrollTo('steps')} className="text-left">{tr('landing.nav.howItWorks')}</button><button onClick={() => scrollTo('experience')} className="text-left">{tr('landing.nav.forStudents')}</button>{signedIn && <button onClick={() => navigate(startPath)} className="text-left">{tr('landing.nav.dashboard')}</button>}<button onClick={startAction} className="flex items-center justify-center gap-2 rounded-lg bg-[#0e1217] px-4 py-3 font-semibold text-white">{tr('landing.nav.getStarted')} <ArrowRight size={14} /></button></div></div>}

      <main>
        <section className="mx-auto max-w-[1200px] px-5 pb-16 pt-24 sm:px-8 sm:pb-24 sm:pt-32 lg:pt-40">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#b85228]">{tr('landing.hero.eyebrow')}</p>
              <h1 className="max-w-4xl text-[3.3rem] font-medium leading-[0.96] tracking-[-0.065em] sm:text-[5.5rem] lg:text-[6.8rem]">{tr('landing.hero.titleBefore')} <em className="font-serif font-normal tracking-[-0.08em] text-[#b85d38]">{tr('landing.hero.titleEm')}</em> {tr('landing.hero.titleAfter')}</h1>
            </div>
            <div className="flex flex-col justify-end lg:col-span-4 lg:pb-2">
              <p className="max-w-md text-lg leading-8 text-[#5e6670]">{tr('landing.hero.body')}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4"><button onClick={startAction} className="flex h-12 items-center gap-3 rounded-lg bg-[#0e1217] px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">{tr('landing.hero.start')} <ArrowRight size={15} /></button><button onClick={() => scrollTo('method')} className="flex h-12 items-center gap-2 rounded-lg border border-[#0e1217]/15 px-5 text-sm font-semibold text-[#0e1217] hover:border-[#0e1217]/40">{tr('landing.hero.see')}</button></div>
            </div>
          </div>

          <div className="mt-16 overflow-hidden rounded-2xl bg-[#0e1217] text-white lg:mt-24">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[0.18em] text-white/45 sm:px-8"><span><span className="mx-2 inline-block h-2 w-2 rounded-full bg-[#ff6a2b]" />{tr('landing.live.label')}</span><span>01 / 06</span></div>
            <div className="grid gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1fr_260px] lg:gap-16">
              <div><p className="text-sm font-medium text-[#ff6a2b]">{tr('landing.live.asks')}</p><p className="mt-5 max-w-2xl font-serif text-3xl leading-tight text-white sm:text-5xl">{tr('landing.live.question')}</p><div className="mt-12 flex items-end gap-1 border-b border-white/15 pb-4"><span className="h-5 w-1 rounded-full bg-[#ff6a2b]" /><span className="h-8 w-1 rounded-full bg-[#ff6a2b]" /><span className="h-12 w-1 rounded-full bg-[#ff6a2b]" /><span className="h-7 w-1 rounded-full bg-[#ff6a2b]" /><span className="h-4 w-1 rounded-full bg-[#ff6a2b]" /><span className="ml-2 text-xs text-white/40">{tr('landing.live.evidence')}</span></div></div>
              <div className="border-l border-white/10 pl-0 lg:pl-8"><p className="text-xs uppercase tracking-[0.16em] text-white/40">{tr('landing.live.noteLabel')}</p><p className="mt-4 text-lg leading-7 text-white/80">{tr('landing.live.note')}</p><button onClick={startAction} className="mt-8 flex items-center gap-2 rounded-lg bg-[#ff6a2b] px-4 py-3 text-sm font-semibold text-[#0e1217] transition-transform hover:-translate-y-0.5">{tr('landing.live.try')} <ArrowRight size={14} /></button></div>
            </div>
          </div>
          <div className="grid border-b border-[#0e1217]/15 sm:grid-cols-3"><div className="border-b border-[#0e1217]/15 py-5 text-sm font-medium sm:border-b-0 sm:border-r">01&nbsp;&nbsp; {tr('landing.trust.1')}</div><div className="border-b border-[#0e1217]/15 py-5 text-sm font-medium sm:border-b-0 sm:border-r sm:pl-6">02&nbsp;&nbsp; {tr('landing.trust.2')}</div><div className="py-5 text-sm font-medium sm:pl-6">03&nbsp;&nbsp; {tr('landing.trust.3')}</div></div>
        </section>

        <section id="method" className="border-y border-white/30 bg-white/20 px-5 py-24 backdrop-blur-[2px] sm:px-8 sm:py-32"><div className="mx-auto max-w-[1200px]"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b85228]">{tr('landing.shift.eyebrow')}</p><div className="mt-5 grid gap-10 lg:grid-cols-12 lg:gap-8"><h2 className="text-4xl font-medium leading-[1.02] tracking-[-0.06em] sm:text-6xl lg:col-span-7">{tr('landing.shift.title')}</h2><p className="text-base leading-7 text-[#5e6670] lg:col-span-4 lg:col-start-9">{tr('landing.shift.body')}</p></div><div className="mt-16 grid gap-5 md:grid-cols-2"><div className="min-h-[360px] border border-[#0e1217]/10 bg-[#eadfcf] p-7 sm:p-10"><p className="font-mono text-xs text-[#8c8376]">{tr('landing.shift.scriptTag')}</p><h3 className="mt-28 text-3xl font-medium tracking-[-0.05em]">{tr('landing.shift.scriptTitle')}</h3><p className="mt-4 max-w-sm leading-7 text-[#6f6b64]">{tr('landing.shift.scriptBody')}</p></div><div className="min-h-[360px] bg-[#0e1217] p-7 text-white sm:p-10"><p className="font-mono text-xs text-[#ff6a2b]">{tr('landing.shift.thinkTag')}</p><h3 className="mt-28 text-3xl font-medium tracking-[-0.05em]">{tr('landing.shift.thinkTitle')}</h3><p className="mt-4 max-w-sm leading-7 text-white/60">{tr('landing.shift.thinkBody')}</p></div></div></div></section>

        <section id="steps" className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32"><div className="grid gap-10 lg:grid-cols-12"><div className="lg:col-span-7"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b85228]">{tr('landing.steps.eyebrow')}</p><h2 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.06em] sm:text-6xl">{tr('landing.steps.title')}</h2></div><p className="max-w-sm text-base leading-7 text-[#5e6670] lg:col-span-4 lg:col-start-9 lg:pt-10">{tr('landing.steps.body')}</p></div><div className="mt-16 grid gap-px border-y border-[#0e1217]/10 bg-[#0e1217]/10 sm:grid-cols-2 lg:grid-cols-3">{steps.map((step) => { const Icon = step.icon; return <button key={step.number} onClick={() => navigate(step.number === '01' ? '/auth/signup' : step.number === '06' ? '/progress' : step.number === '03' ? startPath : step.number === '05' || step.number === '04' ? (signedIn ? '/setup' : '/auth/signup') : (signedIn ? '/onboarding' : '/auth/signup'))} className={`group min-h-[290px] p-6 text-left transition-colors sm:p-8 ${step.dark ? 'bg-[#0e1217] text-white' : 'bg-[#fbf6ee] hover:bg-[#f3eadb]'}`}><div className="flex items-start justify-between"><span className={`font-mono text-xs ${step.dark ? 'text-[#ff6a2b]' : 'text-[#b85228]'}`}>{step.number} / {tr(`landing.${step.id}.label`)}</span><Icon size={20} className={step.dark ? 'text-[#ff6a2b]' : 'text-[#0e1217]'} /></div><h3 className="mt-20 text-2xl font-medium leading-tight tracking-[-0.04em]">{tr(`landing.${step.id}.title`)}</h3><p className={`mt-3 text-sm leading-6 ${step.dark ? 'text-white/60' : 'text-[#5e6670]'}`}>{tr(`landing.${step.id}.desc`)}</p><span className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${step.dark ? 'text-white' : 'text-[#0e1217]'}`}>{tr(`landing.${step.id}.action`)}<ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></span></button>; })}</div></section>

        <section id="experience" className="bg-[#0e1217]/75 px-5 py-24 text-white backdrop-blur-sm sm:px-8 sm:py-32"><div className="mx-auto grid max-w-[1200px] items-center gap-16 lg:grid-cols-12"><div className="lg:col-span-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6a2b]">{tr('landing.exp.eyebrow')}</p><h2 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.06em] sm:text-6xl">{tr('landing.exp.title')}</h2><p className="mt-6 text-base leading-7 text-white/60">{tr('landing.exp.body')}</p><ul className="mt-8 space-y-4 text-sm text-white/80"><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#ff6a2b]" />{tr('landing.exp.list1')}</li><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#ff6a2b]" />{tr('landing.exp.list2')}</li><li className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-[#ff6a2b]" />{tr('landing.exp.list3')}</li></ul></div><div className="lg:col-span-7"><div className="border border-white/15 bg-[#171c23] p-5 sm:p-8"><div className="flex items-center justify-between border-b border-white/10 pb-5 text-xs uppercase tracking-[0.16em] text-white/40"><span><span className="mx-2 inline-block h-2 w-2 rounded-full bg-[#ff6a2b]" />{tr('landing.live.label')}</span><span>12:04</span></div><div className="min-h-[270px] py-10"><p className="text-sm text-[#ff6a2b]">Veyra</p><p className="mt-5 max-w-xl font-serif text-3xl leading-tight text-white sm:text-5xl">Tell me about a time you changed your mind.</p><div className="mt-12 max-w-md border-l-2 border-[#ff6a2b] pl-4 text-sm leading-6 text-white/55">{tr('landing.exp.caption')}</div></div><div className="flex items-center justify-between border-t border-white/10 pt-5"><span className="text-xs text-white/40">{tr('landing.exp.ready')}</span><button onClick={startAction} className="flex items-center gap-2 rounded-lg bg-[#ff6a2b] px-4 py-3 text-sm font-semibold text-[#0e1217]">{tr('landing.live.try')} <ArrowRight size={14} /></button></div></div></div></div></section>

        <section className="px-5 py-24 sm:px-8 sm:py-32"><div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-10 rounded-2xl bg-[#0e1217] px-6 py-12 text-white sm:px-12 sm:py-16 md:flex-row md:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6a2b]">{tr('landing.cta.eyebrow')}</p><h2 className="mt-5 max-w-2xl text-4xl font-medium leading-[1] tracking-[-0.06em] sm:text-6xl">{tr('landing.cta.titleBefore')} <em className="font-serif font-normal text-[#e7a17c]">{tr('landing.cta.titleEm')}</em></h2></div><button onClick={startAction} className="flex h-12 shrink-0 items-center gap-3 rounded-lg bg-[#ff6a2b] px-5 text-sm font-semibold text-[#0e1217]">{tr('landing.cta.start')} <ArrowRight size={15} /></button></div></section>
      </main>
      <footer className="border-t border-[#0e1217]/10 px-5 py-8 sm:px-8"><div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-4 sm:flex-row sm:items-center"><Logo size="sm" /><p className="text-xs text-[#5e6670]">© {new Date().getFullYear()} Veyra. {tr('landing.footer.tagline')}</p></div></footer>
    </div>
  );
}
