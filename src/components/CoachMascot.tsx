import { useState } from 'react';
import { MessageCircle, Send, Sparkles, X, RotateCcw } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface ChatMessage {
  id: number;
  role: 'coach' | 'user';
  text: string;
}

const starters = ['How do I improve?', 'Give me a practice tip', 'I feel nervous'];

function coachReply(input: string, name: string): string {
  const value = input.toLowerCase();
  if (value.includes('nervous') || value.includes('anxious') || value.includes('stress')) {
    return `That feeling is normal, ${name}. Take one slow breath, then answer with one clear point and one real example. You do not need to sound perfect — you need to sound prepared.`;
  }
  if (value.includes('improve') || value.includes('weak') || value.includes('feedback')) {
    return 'Focus on one improvement at a time. Start with the STAR shape: describe the situation, your task, the action you took, and the result. Then try the same question again.';
  }
  if (value.includes('tip') || value.includes('practice') || value.includes('question')) {
    return 'A strong answer usually has three beats: lead with your point, support it with a specific example, and close with what you learned or achieved.';
  }
  if (value.includes('hello') || value.includes('hi')) {
    return `Hi ${name}. I am here to help you turn practice into confidence. Ask me anything about your next interview.`;
  }
  return 'I am listening. Try telling me what opportunity you are preparing for, or ask for a tip on clarity, structure, examples, or confidence.';
}

export function CoachMascot() {
  const { profile, route } = useApp();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'coach',
      text: `Hi${profile?.name ? ` ${profile.name}` : ''}! I am Veyra's practice coach. Need a little guidance?`,
    },
  ]);

  const name = profile?.name || 'there';
  const isInterview = route.startsWith('/interview');

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMessage: ChatMessage = { id: Date.now(), role: 'user', text: trimmed };
    const reply: ChatMessage = {
      id: Date.now() + 1,
      role: 'coach',
      text: coachReply(trimmed, name),
    };
    setMessages((current) => [...current, userMessage, reply]);
    setDraft('');
  };

  const resetChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: 'coach',
        text: `Fresh start, ${name}. What would you like to work on?`,
      },
    ]);
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6 ${isInterview ? 'print:hidden' : ''}`}>
      {open && (
        <div className="coach-panel mb-3 flex w-[min(360px,calc(100vw-32px))] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-veyra-200 bg-white shadow-2xl">
          <div className="relative overflow-hidden bg-charcoal-900 px-4 pb-4 pt-3 text-white">
            <div className="absolute -right-8 -top-12 h-28 w-28 rounded-full bg-veyra-500/30 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="mascot-avatar h-12 w-12 overflow-hidden rounded-2xl border-2 border-white/30 bg-veyra-100">
                  <img src="/assets/images/file_00000000280082108f46a0374fb862c2.png" alt="Veyra mascot" className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-bold">Veyra Coach <Sparkles size={13} className="text-veyra-300" /></p>
                  <p className="text-xs text-white/65">Your practice sidekick</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white" aria-label="Close coach">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="coach-messages flex max-h-72 min-h-40 flex-col gap-3 overflow-y-auto bg-warm-50/70 p-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'items-end gap-2'}`}>
                {message.role === 'coach' && <img src="/assets/images/file_00000000280082108f46a0374fb862c2.png" alt="" className="h-6 w-6 rounded-lg object-cover" />}
                <div className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${message.role === 'user' ? 'rounded-br-md bg-veyra-500 text-white' : 'rounded-bl-md border border-warm-200 bg-white text-charcoal-800'}`}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-warm-200 bg-white p-3">
            <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1">
              {starters.map((starter) => (
                <button key={starter} onClick={() => sendMessage(starter)} className="shrink-0 rounded-full border border-veyra-200 bg-veyra-50 px-2.5 py-1 text-xs font-medium text-veyra-700 transition-colors hover:bg-veyra-100">
                  {starter}
                </button>
              ))}
            </div>
            <form onSubmit={(event) => { event.preventDefault(); sendMessage(draft); }} className="flex items-center gap-2">
              <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask your coach..." className="input-field !py-2.5" aria-label="Message your coach" />
              <button type="submit" disabled={!draft.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-veyra-500 text-white transition-colors hover:bg-veyra-600 disabled:opacity-40" aria-label="Send message">
                <Send size={16} />
              </button>
            </form>
            <button onClick={resetChat} className="mt-2 flex items-center gap-1 text-xs text-charcoal-700/70 transition-colors hover:text-charcoal-900">
              <RotateCcw size={12} /> Reset conversation
            </button>
          </div>
        </div>
      )}

      <button onClick={() => setOpen((current) => !current)} className={`coach-launcher group relative ml-auto flex items-center gap-2 rounded-full bg-charcoal-900 p-1.5 pr-4 text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-charcoal-800 ${open ? 'ring-4 ring-veyra-200' : ''}`} aria-label={open ? 'Close Veyra Coach' : 'Open Veyra Coach'}>
        <span className="absolute inset-0 rounded-full bg-veyra-400/30 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
        <span className="relative block h-11 w-11 overflow-hidden rounded-full border-2 border-white/80 bg-veyra-100">
          <img src="/assets/images/file_00000000280082108f46a0374fb862c2.png" alt="Veyra mascot" className="h-full w-full object-cover" />
        </span>
        <span className="relative hidden text-sm font-semibold sm:block">Chat with Veyra</span>
        {!open && <span className="coach-ping absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-veyra-400 ring-2 ring-white" />}
        <MessageCircle size={17} className="relative sm:hidden" />
      </button>
    </div>
  );
}
