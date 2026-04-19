import { useState } from "react";

import { supabase } from "../lib/supabase.js";

export function ProfileSetupScreen({ user, onComplete }) {
  const [firstName, setFirstName] = useState("");
  const [handicap, setHandicap] = useState("");
  const [dominantHand, setDominantHand] = useState("right");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const trimmed = firstName.trim();
    if (!trimmed) {
      setError("Please enter your first name.");
      return;
    }

    let handicapValue = null;
    if (handicap.trim() !== "") {
      const n = Number.parseFloat(handicap);
      if (Number.isNaN(n)) {
        setError("Handicap must be a number (e.g. 24 or 24.5).");
        return;
      }
      handicapValue = n;
    }

    setBusy(true);
    try {
      const { data, error: insertError } = await supabase
        .from("golfer_profiles")
        .insert({
          user_id: user.id,
          first_name: trimmed,
          handicap: handicapValue,
          dominant_hand: dominantHand,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      onComplete(data);
    } catch (err) {
      setError(err.message || "Could not save your profile.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="dw-app dw-profile-setup">
      <div className="dw-profile-inner">
        <div className="dw-auth-logo">downwind</div>
        <p className="dw-auth-tagline">Better. Every single session, big dog.</p>

        <h1 className="dw-profile-heading">Tell Whisper about your game</h1>

        <form className="dw-auth-form" onSubmit={handleSubmit}>
          <label className="dw-auth-label">
            <span className="dw-auth-label-text">First name</span>
            <input
              className="dw-auth-input"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(ev) => setFirstName(ev.target.value)}
              required
            />
          </label>

          <label className="dw-auth-label">
            <span className="dw-auth-label-text">Handicap</span>
            <input
              className="dw-auth-input"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 24 or 24.5"
              value={handicap}
              onChange={(ev) => setHandicap(ev.target.value)}
            />
          </label>

          <div className="dw-profile-hand-block">
            <span className="dw-auth-label-text">Dominant hand</span>
            <div className="dw-hand-pills">
              <button
                type="button"
                className={`dw-hand-pill${dominantHand === "left" ? " dw-hand-pill--active" : ""}`}
                onClick={() => setDominantHand("left")}
              >
                Left
              </button>
              <button
                type="button"
                className={`dw-hand-pill${dominantHand === "right" ? " dw-hand-pill--active" : ""}`}
                onClick={() => setDominantHand("right")}
              >
                Right
              </button>
            </div>
          </div>

          {error ? (
            <p className="dw-status dw-status--error dw-auth-error">{error}</p>
          ) : null}

          <button
            type="submit"
            className="dw-btn-full dw-btn-gold"
            disabled={busy}
          >
            {busy ? "Saving…" : "Start Coaching"}
          </button>
        </form>
      </div>
    </div>
  );
}
