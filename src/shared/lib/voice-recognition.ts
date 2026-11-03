// Keep vendor-specific types local; the DOM library does not type recognition.
export type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onresult:
    | ((event: {
        results: ArrayLike<ArrayLike<{ transcript: string }>>;
      }) => void)
    | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

export type RecognitionConstructor = new () => Recognition;
export type VoiceStatus = "idle" | "starting" | "listening" | "stopping";

export function getRecognitionConstructor():
  RecognitionConstructor | undefined {
  if (typeof window === "undefined") return;
  const browser = window as Window & {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  return browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
}

export function createVoiceRecognition(callbacks: {
  onStatus: (status: VoiceStatus) => void;
  onError: (error: string) => void;
}) {
  let session: Recognition | undefined;
  let status: VoiceStatus = "idle";
  let expectedValue = "";
  let onChange: (value: string) => void = () => {};
  let disabled = false;

  function setStatus(next: VoiceStatus) {
    status = next;
    callbacks.onStatus(next);
  }

  function release(abort: boolean, notify = true) {
    const current = session;
    session = undefined;
    if (current) {
      current.onstart =
        current.onresult =
        current.onerror =
        current.onend =
          null;
      if (abort) {
        try {
          current.abort();
        } catch {
          // Some engines throw if recognition has already disconnected.
        }
      }
    }
    if (notify) setStatus("idle");
    else status = "idle";
  }

  return {
    sync(value: string, change: (value: string) => void, inactive: boolean) {
      // An external edit or reset wins over all pending recognition events.
      if (session && (value !== expectedValue || inactive)) release(true);
      expectedValue = value;
      onChange = change;
      disabled = inactive;
    },
    toggle(Constructor: RecognitionConstructor | undefined) {
      if (disabled) return;
      if (session) {
        if (status === "stopping") return;
        if (status === "starting") {
          release(true);
          return;
        }
        setStatus("stopping");
        try {
          session.stop();
        } catch {
          release(true);
        }
        return;
      }
      if (!Constructor) {
        callbacks.onError("unsupported");
        return;
      }
      const prefix = expectedValue;
      try {
        const current = new Constructor();
        session = current;
        current.lang = "fa-IR";
        current.interimResults = true;
        current.continuous = true;
        current.onstart = () => {
          if (session === current && status === "starting")
            setStatus("listening");
        };
        current.onresult = ({ results }) => {
          if (session !== current) return;
          // Results are a full session snapshot. Rebuild instead of appending
          // interim/final events, which would repeat previously recognized words.
          const transcript = Array.from(
            results,
            (result) => result[0]?.transcript.trim() ?? "",
          )
            .filter(Boolean)
            .join(" ");
          const next = transcript
            ? `${prefix}${prefix && !/\s$/.test(prefix) ? " " : ""}${transcript}`
            : prefix;
          if (next === expectedValue) return;
          expectedValue = next;
          onChange(next);
        };
        current.onerror = ({ error }) => {
          if (session !== current) return;
          release(true);
          if (error !== "aborted") callbacks.onError(error);
        };
        current.onend = () => {
          if (session === current) release(false);
        };
        setStatus("starting");
        current.start();
      } catch (error) {
        release(true);
        callbacks.onError(
          error instanceof Error && error.name === "NotAllowedError"
            ? "not-allowed"
            : "start-failed",
        );
      }
    },
    cancel() {
      release(true);
    },
    dispose() {
      release(true, false);
    },
  };
}
