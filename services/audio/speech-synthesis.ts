export type SpeechOutputHandlers = {
  onStart?: () => void;
  onBoundary?: () => void;
  onEnd?: () => void;
};

export type SpeechPlaybackState = "playing" | "paused" | "stopped";

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

const activityTarget: EventTarget | null =
  typeof window !== "undefined" ? new EventTarget() : null;

/** Fires once per speech boundary (roughly per word) while JARVIS is speaking. */
export function subscribeSpeechActivity(callback: () => void): () => void {
  if (!activityTarget) return () => {};
  activityTarget.addEventListener("tick", callback);
  return () => activityTarget.removeEventListener("tick", callback);
}

let currentSpeechId: string | null = null;
let currentState: SpeechPlaybackState = "stopped";

function setState(id: string | null, state: SpeechPlaybackState) {
  currentSpeechId = id;
  currentState = state;
  activityTarget?.dispatchEvent(new Event("state"));
}

/** Fires whenever the currently playing/paused message id changes. */
export function subscribeSpeechState(
  callback: (id: string | null, state: SpeechPlaybackState) => void,
): () => void {
  if (!activityTarget) return () => {};
  const handler = () => callback(currentSpeechId, currentState);
  activityTarget.addEventListener("state", handler);
  return () => activityTarget.removeEventListener("state", handler);
}

export function getSpeechState(): { id: string | null; state: SpeechPlaybackState } {
  return { id: currentSpeechId, state: currentState };
}

let preferredVoice: SpeechSynthesisVoice | null = null;

function pickVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSynthesisSupported()) return null;
  if (preferredVoice) return preferredVoice;

  const voices = window.speechSynthesis.getVoices();
  preferredVoice =
    voices.find((v) => /male|daniel|david|google uk english male/i.test(v.name)) ??
    voices.find((v) => v.lang.startsWith("en")) ??
    voices[0] ??
    null;
  return preferredVoice;
}

export function speak(id: string, text: string, handlers: SpeechOutputHandlers = {}) {
  if (!isSpeechSynthesisSupported()) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.02;
  utterance.pitch = 0.85;
  const voice = pickVoice();
  if (voice) utterance.voice = voice;

  utterance.onstart = () => {
    setState(id, "playing");
    handlers.onStart?.();
  };
  utterance.onboundary = () => {
    handlers.onBoundary?.();
    activityTarget?.dispatchEvent(new Event("tick"));
  };
  utterance.onpause = () => setState(id, "paused");
  utterance.onresume = () => setState(id, "playing");
  utterance.onend = () => {
    setState(null, "stopped");
    handlers.onEnd?.();
  };
  utterance.onerror = () => {
    setState(null, "stopped");
    handlers.onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
}

export function pauseSpeaking() {
  if (isSpeechSynthesisSupported() && window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
  }
}

export function resumeSpeaking() {
  if (isSpeechSynthesisSupported() && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
}

export function stopSpeaking() {
  if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel();
  setState(null, "stopped");
}
