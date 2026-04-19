/**
 * Coach (main) screen — presentation only. Voice / API logic lives in App.jsx.
 */
export function CoachScreen({
  waitingPhrase,
  showWaitingPhrase,
  visualState,
  isListening,
  recordingSupported,
  buttonLabel,
  micLevel,
  ringDrift,
  transcript,
  response,
  showCoachCard,
  error,
  showActionBar,
  isSpeaking,
  onVoiceButtonClick,
  onVoiceKeyDown,
  onReply,
  onNextShot,
  onStopSpeaking,
}) {
  return (
    <div className="dw-coach">
      <header className="dw-logo-banner">
        <div className="dw-logo-text">downwind</div>
        <p className="dw-logo-tagline">Better. Every single session, big dog.</p>
      </header>

      <div className="dw-coach-body">
        <div className="dw-whisper-status">
          <span className="dw-w-dot" aria-hidden />
          <span className="dw-w-label">WHISPER IS READY</span>
        </div>

        {showWaitingPhrase && (
          <p className="dw-waiting-phrase">{waitingPhrase}</p>
        )}

        <div
          className={`dw-siri-wrap dw-siri-wrap--${visualState}${isListening ? " dw-siri-wrap--listening" : ""}`}
          style={{
            "--level": micLevel.toFixed(3),
            "--energy": micLevel.toFixed(3),
            "--drift-a": `${ringDrift.a.toFixed(2)}px`,
            "--drift-b": `${ringDrift.b.toFixed(2)}px`,
            "--drift-c": `${ringDrift.c.toFixed(2)}px`,
          }}
        >
          <span className="dw-ring dw-ring--1" />
          <span className="dw-ring dw-ring--2" />
          <span className="dw-ring dw-ring--3" />
          <button
            type="button"
            className={`dw-voice-btn dw-voice-btn--${visualState}`}
            onClick={onVoiceButtonClick}
            onKeyDown={onVoiceKeyDown}
            disabled={!recordingSupported || visualState === "thinking"}
            aria-pressed={isListening}
          >
            <span className="dw-voice-btn-icon" aria-hidden>
              🎙
            </span>
            {buttonLabel ? (
              <span className="dw-voice-btn-label">{buttonLabel}</span>
            ) : null}
          </button>
        </div>

        {!recordingSupported && (
          <p className="dw-status dw-status--error">
            MediaRecorder or microphone access is not available in this browser.
          </p>
        )}
        {error && <p className="dw-status dw-status--error">{error}</p>}

        {showCoachCard && (
          <section className="dw-coach-card" aria-live="polite">
            <div className="dw-coach-card-hdr">You said</div>
            <p className="dw-transcript-line">&ldquo;{transcript}&rdquo;</p>
            <div className="dw-coach-card-hdr">Whisper</div>
            <p className="dw-coach-line">{response}</p>
            {isSpeaking && (
              <button
                type="button"
                className="dw-stop-tts"
                onClick={onStopSpeaking}
              >
                Stop voice
              </button>
            )}
          </section>
        )}
      </div>

      {showActionBar && (
        <div className="dw-bottom-actions">
          <div className="dw-action-row">
            <button
              type="button"
              className="dw-action-btn dw-action-btn--secondary"
              onClick={onReply}
            >
              Reply
            </button>
            <button
              type="button"
              className="dw-action-btn dw-action-btn--primary"
              onClick={onNextShot}
            >
              Next Shot
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
