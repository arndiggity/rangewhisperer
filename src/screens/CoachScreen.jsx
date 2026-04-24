/**
 * Coach (main) screen — presentation only. Voice / API logic lives in CoachExperience.jsx.
 */
export function CoachScreen({
  profile,
  rangeSession,
  onStartRangeSession,
  onEndRangeSession,
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
  showTextInput,
  typedMessage,
  onTypedMessageChange,
  onOpenTextInput,
  onCancelTextInput,
  onSubmitTypedMessage,
  isDeleteConfirmOpen,
  onRequestDeleteShot,
  onCancelDeleteShot,
  onConfirmDeleteShot,
  onVoiceButtonClick,
  onVoiceKeyDown,
  onReply,
  onAnotherCue,
  onNextShot,
  onStopSpeaking,
  onSignOut,
}) {
  return (
    <div
      className="dw-coach"
      data-profile-name={profile?.first_name ?? ""}
    >
      <header className="dw-logo-banner">
        {typeof onSignOut === "function" ? (
          <button
            type="button"
            className="dw-sign-out"
            onClick={onSignOut}
            aria-label="Sign out"
          >
            <svg
              className="dw-sign-out-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        ) : null}
        <div className="dw-logo-text">downwind</div>
        <p className="dw-logo-tagline">Better. Every single session, big dog.</p>
      </header>

      {typeof onStartRangeSession === "function" &&
      typeof onEndRangeSession === "function" ? (
        <div className="dw-session-bar">
          {!rangeSession ? (
            <button
              type="button"
              className="dw-session-pill dw-session-pill--cta"
              onClick={onStartRangeSession}
            >
              Start Range Session
            </button>
          ) : (
            <div className="dw-session-active">
              <span className="dw-session-status">
                Session active · {rangeSession.shot_count ?? 0} shots
              </span>
              <button
                type="button"
                className="dw-session-pill dw-session-pill--end"
                onClick={onEndRangeSession}
              >
                End
              </button>
            </div>
          )}
        </div>
      ) : null}

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
          <button
            type="button"
            className="dw-text-fallback-btn"
            onClick={onOpenTextInput}
            aria-label="Type shot instead"
          >
            <svg viewBox="0 0 24 24" className="dw-text-fallback-icon" aria-hidden>
              <path
                d="M4 20h4l10-10a2.12 2.12 0 0 0-3-3L5 17v3zM13.5 6.5l3 3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {showTextInput ? (
          <form className="dw-text-fallback-panel" onSubmit={onSubmitTypedMessage}>
            <textarea
              className="dw-text-fallback-input"
              rows={3}
              placeholder="Type your shot..."
              value={typedMessage}
              onChange={(event) => onTypedMessageChange(event.target.value)}
            />
            <div className="dw-text-fallback-actions">
              <button type="submit" className="dw-action-btn dw-action-btn--primary">
                Send
              </button>
              <button
                type="button"
                className="dw-text-fallback-cancel"
                onClick={onCancelTextInput}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

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
            <button
              type="button"
              className="dw-delete-shot-link"
              onClick={onRequestDeleteShot}
            >
              Delete this shot
            </button>
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
              className="dw-action-btn dw-action-btn--secondary"
              onClick={onAnotherCue}
            >
              Another Cue
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

      {isDeleteConfirmOpen ? (
        <div className="dw-modal-overlay" role="presentation">
          <div className="dw-modal-card" role="dialog" aria-modal="true">
            <p className="dw-modal-title">Delete this shot? This can&apos;t be undone.</p>
            <div className="dw-modal-actions">
              <button
                type="button"
                className="dw-action-btn dw-action-btn--secondary"
                onClick={onCancelDeleteShot}
              >
                Cancel
              </button>
              <button
                type="button"
                className="dw-action-btn dw-action-btn--primary"
                onClick={onConfirmDeleteShot}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
