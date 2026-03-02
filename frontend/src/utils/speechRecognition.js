/**
 * Speech Recognition Utility
 * Uses Web Speech API for speech-to-text conversion
 */

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  console.warn('Speech Recognition API not supported in this browser');
}

export const startListening = (onResult, onError, onEnd) => {
  if (!SpeechRecognition) {
    onError('Speech Recognition not supported');
    return null;
  }

  const recognition = new SpeechRecognition();


  recognition.language = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;


  recognition.onstart = () => {
    console.log('🎤 Listening started...');
  };

  recognition.onresult = (event) => {
    let transcript = '';


    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcriptSegment = event.results[i][0].transcript;
      transcript += transcriptSegment;
    }

    if (event.results[0].isFinal) {
      console.log('📝 Transcript:', transcript);
      onResult(transcript);
    }
  };

  recognition.onerror = (event) => {
    console.error('❌ Speech recognition error:', event.error);
    onError(event.error);
  };

  recognition.onend = () => {
    console.log('🛑 Listening stopped');
    onEnd();
  };


  try {
    recognition.start();
    return recognition;
  } catch (error) {
    console.error('Error starting recognition:', error);
    onError(error.message);
    return null;
  }
};

export const stopListening = (recognition) => {
  if (recognition) {
    try {
      recognition.stop();
    } catch (error) {
      console.error('Error stopping recognition:', error);
    }
  }
};

export const abortListening = (recognition) => {
  if (recognition) {
    try {
      recognition.abort();
    } catch (error) {
      console.error('Error aborting recognition:', error);
    }
  }
};
