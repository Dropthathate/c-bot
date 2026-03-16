// The World-First "In-Ear" Whisper Logic
export const whisperToTherapist = (message: string) => {
    const speech = new SpeechSynthesisUtterance(message);
    
    // Set a professional, calm clinical tone
    speech.volume = 0.7; // Not too loud to distract
    speech.rate = 0.9;   // Slightly slower for clarity
    speech.pitch = 1.1;  // Clear, distinct frequency
    
    window.speechSynthesis.speak(speech);
};