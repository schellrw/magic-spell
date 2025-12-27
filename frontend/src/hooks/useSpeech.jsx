import { useState, useCallback, useEffect } from 'react';

export default function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Smart Default: Priority list for better voices
      const preferredVoice = availableVoices.find(v => v.name.includes('Google US English')) 
        || availableVoices.find(v => v.name.includes('Zira')) // Windows Female
        || availableVoices.find(v => v.name.includes('Samantha')) // Mac Female
        || availableVoices.find(v => v.lang.startsWith('en') && v.name.includes('Female'))
        || availableVoices.find(v => v.lang.startsWith('en'));

      if (preferredVoice) {
        setSelectedVoice(preferredVoice);
      }
    };

    // Chrome loads voices asynchronously
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const cycleVoice = useCallback(() => {
    if (voices.length === 0) return;
    const currentIndex = voices.findIndex(v => v === selectedVoice);
    const nextIndex = (currentIndex + 1) % voices.length;
    setSelectedVoice(voices[nextIndex]);
  }, [voices, selectedVoice]);

  const speak = useCallback((text, options = {}) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Natural voices often don't need as much slowing down or pitch shifting
    utterance.rate = options.rate || 0.8; 
    utterance.pitch = options.pitch || 1.1;
    utterance.volume = options.volume || 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [selectedVoice]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking, cycleVoice, currentVoice: selectedVoice };
}
