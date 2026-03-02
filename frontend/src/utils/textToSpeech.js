/**
 * Text-to-Speech Utility
 * Uses Browser SpeechSynthesis API for speech output
 */

export const speak = (text, onCompleted, onError) => {

  if (!('speechSynthesis' in window)) {
    console.error('❌ Speech Synthesis not supported');
    onError('Speech Synthesis not supported');
    return null;
  }


  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);


  utterance.rate = 0.95; // Slightly slower speech
  utterance.pitch = 1.2; // Slightly higher pitch
  utterance.volume = 1;

  utterance.onstart = () => {
    console.log('🔊 Speaking:', text);
  };

  utterance.onend = () => {
    console.log('✅ Speech completed');
    onCompleted();
  };

  utterance.onerror = (event) => {
    console.error('❌ Speech error:', event.error);
    onError(event.error);
  };


  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find((voice) =>
    voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman')
  );

  if (femaleVoice) {
    utterance.voice = femaleVoice;
  } else if (voices.length > 0) {
    utterance.voice = voices[0];
  }


  try {
    window.speechSynthesis.speak(utterance);
    return utterance;
  } catch (error) {
    console.error('Error speaking:', error);
    onError(error.message);
    return null;
  }
};

export const stopSpeaking = () => {
  window.speechSynthesis.cancel();
};

export const isSpeaking = () => {
  return window.speechSynthesis.speaking;
};

/**
 * Load voices with retry logic
 * Voices may not be available immediately upon page load
 */
export const ensureVoicesLoaded = () => {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices());
      };
    }
  });
};
