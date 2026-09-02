export type SpeechRecognitionHandlers = {
  onInterim?: (transcript: string) => void;
  onFinal: (transcript: string) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getConstructor() !== null;
}

export class VoiceInputController {
  private recognition: SpeechRecognitionLike | null = null;

  start(handlers: SpeechRecognitionHandlers): boolean {
    const Ctor = getConstructor();
    if (!Ctor) return false;

    const recognition = new Ctor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) {
          handlers.onFinal(transcript.trim());
        } else {
          interim += transcript;
        }
      }
      if (interim) handlers.onInterim?.(interim.trim());
    };

    recognition.onerror = (event) => {
      handlers.onError?.(event.error);
    };

    recognition.onend = () => {
      handlers.onEnd?.();
    };

    this.recognition = recognition;
    recognition.start();
    return true;
  }

  stop() {
    this.recognition?.stop();
    this.recognition = null;
  }

  abort() {
    this.recognition?.abort();
    this.recognition = null;
  }
}
