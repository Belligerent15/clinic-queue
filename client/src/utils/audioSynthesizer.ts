export const announceTicketCall = (fullCode: string, roomNumber: string) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
  
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.5);

  setTimeout(() => {
    const letters = fullCode.split('');
    const codePhonics = letters.join(' ');
    const phraseText = `Ticket ${codePhonics}. Tsena ka phaposing ya ${roomNumber}`;
    const utterance = new SpeechSynthesisUtterance(phraseText);
    
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.lang = 'en-ZA';
    
    window.speechSynthesis.speak(utterance);
  }, 600);
};
