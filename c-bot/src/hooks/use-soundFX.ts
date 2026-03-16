// src/hooks/useSoundFX.ts
import { useCallback } from 'react';

export const useSoundFX = () => {
  const playPop = useCallback(() => {
    const audio = new Audio('/sounds/pop.mp3'); 
    audio.volume = 0.2; // Keep it subtle so it doesn't distract client
    audio.play().catch(e => console.log("Audio play error", e));
  }, []);

  const playDing = useCallback(() => {
    const audio = new Audio('/sounds/ding.mp3');
    audio.volume = 0.5; // Louder for commands
    audio.play().catch(e => console.log("Audio play error", e));
  }, []);

  return { playPop, playDing };
};