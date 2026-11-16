import { useCallback, useEffect, useRef, useState } from 'react';

function preferredVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | undefined {
  const language = lang.toLowerCase();
  const matching = voices.filter((voice) => voice.lang.toLowerCase().startsWith(language.slice(0, 2)));
  const preferredNames = language.startsWith('fr')
    ? ['Thomas', 'Audrey', 'Amelie', 'Google français']
    : language.startsWith('ar')
    ? ['Maged', 'Google العربية', 'Microsoft']
    : ['Samantha', 'Alex', 'Google US English', 'Microsoft Aria', 'Microsoft David'];

  return matching.find((voice) => preferredNames.some((name) => voice.name.includes(name))) ?? matching[0];
}

export function useSpeechSynthesis() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const updateVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };

    setIsSupported(true);
    updateVoices();
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
  }, []);

  const speak = useCallback((text: string, lang: string = 'en-US') => {
    if (!('speechSynthesis' in window) || !text.trim()) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = lang;
    utterance.voice = preferredVoice(voicesRef.current, lang) ?? null;
    utterance.rate = 0.93;
    utterance.pitch = 1;
    utterance.volume = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, []);

  const cancel = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { isSupported, isSpeaking, speak, cancel };
}

export function langToSpeechCode(lang: string): string {
  switch (lang) {
    case 'fr':
      return 'fr-FR';
    case 'ar':
      return 'ar-SA';
    default:
      return 'en-US';
  }
}
