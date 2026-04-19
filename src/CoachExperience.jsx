import { useEffect, useMemo, useRef, useState } from "react";

import { BottomNav } from "./components/BottomNav.jsx";
import { CoachScreen } from "./screens/CoachScreen.jsx";
import { PlaceholderScreen } from "./screens/PlaceholderScreen.jsx";

const BACKEND_TRANSCRIBE_URL = "/api/transcribe";
const BACKEND_API_URL = "/api/ask";

/** Waiting phrases — order matches `downwind-product-brief.md` (20 random). */
const WAITING_PHRASES = [
  "Waiting for your next shot, big dog.",
  "Grip it. Rip it. Tell me everything.",
  "Every miss is data. Every hit is progress.",
  "The range doesn't lie. Let's see it.",
  "Ready when you are.",
  "Step up. Let's go.",
  "Ball's on the tee. What have you got?",
  "Take your time. The data waits.",
  "Your swing. Your story. Let's write it.",
  "One shot at a time. Make it count.",
  "The best swing of your life could be next.",
  "No judgement. Just improvement.",
  "The range is yours. I am listening.",
  "Breathe. Align. Fire away.",
  "Your caddy is ready. Are you?",
  "Another shot, another lesson.",
  "Trust the process. Hit the ball.",
  "I have got all session. You have got this.",
  "Less thinking. More swinging. Then tell me.",
  "What is the club? What is the target? Let us go.",
];

const pickNextPhrase = (currentPhrase) => {
  if (WAITING_PHRASES.length <= 1) {
    return WAITING_PHRASES[0] || "";
  }

  const candidates = WAITING_PHRASES.filter((phrase) => phrase !== currentPhrase);
  return candidates[Math.floor(Math.random() * candidates.length)];
};

function safeVibrate(pattern) {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch {
    /* ignore */
  }
}

function profileApiPayload(profile) {
  return {
    first_name: profile.first_name ?? null,
    handicap: profile.handicap ?? null,
    dominant_hand: profile.dominant_hand ?? null,
    coaching_style: profile.coaching_style ?? "The Caddy",
  };
}

export function CoachExperience({ profile, onSignOut }) {
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const shouldTranscribeRef = useRef(false);
  const transcriptRef = useRef("");
  const voicesRef = useRef([]);
  const selectedVoiceRef = useRef(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const dataArrayRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [ringDrift, setRingDrift] = useState({ a: 0, b: 0, c: 0 });
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [waitingPhrase, setWaitingPhrase] = useState(() => pickNextPhrase(""));
  const [isReplyMode, setIsReplyMode] = useState(false);
  const [shotThread, setShotThread] = useState([]);
  const [activeTab, setActiveTab] = useState("coach");

  const coachingStyle =
    typeof profile?.coaching_style === "string" && profile.coaching_style.trim()
      ? profile.coaching_style.trim()
      : "The Caddy";

  const prevLoadingRef = useRef(false);
  const prevIdleRef = useRef(null);

  const recordingSupported = useMemo(
    () =>
      typeof window !== "undefined" &&
      typeof MediaRecorder !== "undefined" &&
      Boolean(navigator.mediaDevices?.getUserMedia),
    [],
  );
  const ttsSupported = useMemo(
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    [],
  );

  const clearAudioMeter = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    dataArrayRef.current = null;
    setMicLevel(0);
    setRingDrift({ a: 0, b: 0, c: 0 });
  };

  const attachAudioMeterFromStream = (stream) => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContextClass();
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();

    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.85;
    source.connect(analyser);

    audioContextRef.current = context;
    analyserRef.current = analyser;
    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      if (!analyserRef.current || !dataArrayRef.current) {
        return;
      }

      analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

      let sumSquares = 0;
      for (let i = 0; i < dataArrayRef.current.length; i += 1) {
        const normalized = (dataArrayRef.current[i] - 128) / 128;
        sumSquares += normalized * normalized;
      }

      const rms = Math.sqrt(sumSquares / dataArrayRef.current.length);
      const liveLevel = Math.min(1, rms * 4.2);
      const now = performance.now() * 0.003;
      setMicLevel(liveLevel);
      setRingDrift({
        a: Math.sin(now) * liveLevel * 10,
        b: Math.sin(now + 1.8) * liveLevel * 14,
        c: Math.sin(now + 3.1) * liveLevel * 18,
      });
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    tick();
  };

  const stopSpeaking = () => {
    if (!ttsSupported) {
      return;
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    if (!ttsSupported) {
      return undefined;
    }

    const pickVoice = (voiceList) => {
      return (
        voiceList.find(
          (voice) =>
            voice.lang.toLowerCase() === "en-gb" &&
            voice.name.toLowerCase().includes("daniel"),
        ) ||
        voiceList.find(
          (voice) =>
            voice.lang.toLowerCase().startsWith("en-gb") &&
            voice.name.toLowerCase().includes("daniel"),
        ) ||
        voiceList.find((voice) => voice.lang.toLowerCase().startsWith("en-gb")) ||
        voiceList.find((voice) => voice.lang.toLowerCase().startsWith("en")) ||
        voiceList[0] ||
        null
      );
    };

    const loadVoices = () => {
      const list = window.speechSynthesis.getVoices();
      voicesRef.current = list;
      selectedVoiceRef.current = pickVoice(list);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, [ttsSupported]);

  useEffect(() => {
    return () => {
      shouldTranscribeRef.current = false;
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      clearAudioMeter();
    };
  }, []);

  /** New waiting phrase whenever we enter full idle (no response, not capturing, not thinking). */
  useEffect(() => {
    const idle =
      !isListening &&
      !isLoading &&
      !isSpeaking &&
      !response;

    if (prevIdleRef.current === null) {
      prevIdleRef.current = idle;
      return;
    }

    if (!prevIdleRef.current && idle) {
      setWaitingPhrase((current) => pickNextPhrase(current));
    }
    prevIdleRef.current = idle;
  }, [isListening, isLoading, isSpeaking, response]);

  /** THINKING haptic when /api/transcribe + /api/ask loading starts. */
  useEffect(() => {
    if (isLoading && !prevLoadingRef.current) {
      safeVibrate([50, 50, 50]);
    }
    prevLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    if (!ttsSupported || !response) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(response);
    const voice = selectedVoiceRef.current;

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = "en-GB";
    }

    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => {
      safeVibrate(100);
      setIsSpeaking(true);
    };
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [response, ttsSupported]);

  const sendToClaude = async (messageText) => {
    setIsLoading(true);
    setError("");
    setResponse("");

    try {
      const threadContext =
        shotThread.length > 0
          ? shotThread
              .map((turn) => `${turn.role === "user" ? "Golfer" : "Coach"}: ${turn.text}`)
              .join("\n")
          : "";
      const prompt = isReplyMode
        ? `You are continuing the same golf shot conversation.\n\nConversation so far:\n${threadContext}\n\nLatest golfer update:\n${messageText}\n\nRespond with the next coaching reply.`
        : messageText;

      const apiProfile = profileApiPayload(profile);

      const res = await fetch(BACKEND_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          coachingStyle,
          profile: apiProfile,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const details =
          typeof body?.details === "string" ? ` ${body.details}` : "";
        throw new Error(
          `Backend API error (${res.status}): ${
            body?.error || "Unable to process request."
          }${details}`,
        );
      }

      const data = await res.json();
      const nextResponse = data.response || "No response text received.";
      setResponse(nextResponse);
      setShotThread((prev) => [
        ...prev,
        { role: "user", text: messageText },
        { role: "assistant", text: nextResponse },
      ]);
      setIsReplyMode(true);
    } catch (err) {
      setError(err.message || "Failed to call backend API.");
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = async () => {
    if (!recordingSupported || isLoading || isListening) {
      return;
    }

    shouldTranscribeRef.current = false;
    setError("");
    setTranscript("");
    transcriptRef.current = "";
    if (!isReplyMode) {
      setResponse("");
    }
    stopSpeaking();
    clearAudioMeter();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      try {
        attachAudioMeterFromStream(stream);
      } catch {
        setError("Audio meter unavailable. Recording will still work.");
      }

      recordedChunksRef.current = [];
      const mimeCandidates = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
      ];
      const mimeType = mimeCandidates.find((type) =>
        MediaRecorder.isTypeSupported(type),
      );

      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onerror = (event) => {
        const message =
          event.error?.message || String(event.error || "Unknown error");
        setError(`Recording error: ${message}`);
        setIsListening(false);
        clearAudioMeter();
        mediaRecorderRef.current = null;
      };

      recorder.onstop = async () => {
        setIsListening(false);
        clearAudioMeter();

        const shouldSubmit = shouldTranscribeRef.current;
        shouldTranscribeRef.current = false;

        const resolvedMime = recorder.mimeType || "audio/webm";
        mediaRecorderRef.current = null;

        const blob = new Blob(recordedChunksRef.current, {
          type: resolvedMime,
        });
        recordedChunksRef.current = [];

        if (!shouldSubmit) {
          return;
        }

        if (blob.size === 0) {
          setError("No audio captured.");
          return;
        }

        setIsLoading(true);
        setError("");
        try {
          const ext = resolvedMime.includes("mp4")
            ? "m4a"
            : resolvedMime.includes("webm")
              ? "webm"
              : "webm";
          const formData = new FormData();
          formData.append("file", blob, `recording.${ext}`);

          const res = await fetch(BACKEND_TRANSCRIBE_URL, {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            const details =
              typeof body?.details === "string" ? ` ${body.details}` : "";
            throw new Error(
              `Transcription error (${res.status}): ${
                body?.error || "Unable to transcribe."
              }${details}`,
            );
          }

          const data = await res.json();
          const text =
            typeof data.transcript === "string" ? data.transcript.trim() : "";
          if (!text) {
            throw new Error("Empty transcript.");
          }

          setTranscript(text);
          transcriptRef.current = text;
          await sendToClaude(text);
        } catch (err) {
          setError(err.message || "Transcription failed.");
        } finally {
          setIsLoading(false);
        }
      };

      recorder.start();
      setIsListening(true);
    } catch (err) {
      clearAudioMeter();
      setError(
        err instanceof Error
          ? err.message
          : "Could not start microphone. Check browser mic permissions.",
      );
    }
  };

  const stopListening = () => {
    shouldTranscribeRef.current = true;
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    } else {
      clearAudioMeter();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      return;
    }
    safeVibrate(50);
    void startListening();
  };

  const handleKeyDown = (event) => {
    if ((event.code === "Space" || event.code === "Enter") && !event.repeat) {
      event.preventDefault();
      toggleListening();
    }
  };

  const visualState = isListening
    ? "listening"
    : isLoading
      ? "thinking"
      : isSpeaking
        ? "speaking"
        : "idle";

  const buttonLabel = isListening
    ? "TAP TO STOP"
    : isLoading
      ? ""
      : isSpeaking
        ? ""
        : "TAP TO TALK";

  const showPostResponseActions =
    Boolean(response) && !isSpeaking && !isListening && !isLoading;

  const showWaitingPhrase =
    !response && !isListening && !isLoading;

  const showCoachCard = Boolean(response);

  const handleReply = () => {
    setError("");
  };

  const handleNextShot = () => {
    stopSpeaking();
    shouldTranscribeRef.current = false;
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    clearAudioMeter();
    setIsListening(false);
    setIsLoading(false);
    setTranscript("");
    transcriptRef.current = "";
    setResponse("");
    setError("");
    setIsReplyMode(false);
    setShotThread([]);
    setWaitingPhrase((current) => pickNextPhrase(current));
  };

  return (
    <div className="dw-app">
      {activeTab === "coach" && (
        <CoachScreen
          profile={profile}
          waitingPhrase={waitingPhrase}
          showWaitingPhrase={showWaitingPhrase}
          visualState={visualState}
          isListening={isListening}
          recordingSupported={recordingSupported}
          buttonLabel={buttonLabel}
          micLevel={micLevel}
          ringDrift={ringDrift}
          transcript={transcript}
          response={response}
          showCoachCard={showCoachCard}
          error={error}
          showActionBar={showPostResponseActions}
          isSpeaking={isSpeaking}
          onVoiceButtonClick={toggleListening}
          onVoiceKeyDown={handleKeyDown}
          onReply={handleReply}
          onNextShot={handleNextShot}
          onStopSpeaking={stopSpeaking}
          onSignOut={onSignOut}
        />
      )}
      {activeTab === "programmes" && <PlaceholderScreen title="Programmes" />}
      {activeTab === "my-golf" && <PlaceholderScreen title="My Golf" />}
      <BottomNav active={activeTab} onSelect={setActiveTab} />
    </div>
  );
}
