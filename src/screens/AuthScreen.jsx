import { useState } from "react";

import { supabase } from "../lib/supabase.js";

export function AuthScreen() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isSignUp = mode === "signup";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isSignUp) {
        const { error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (err) throw err;
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (err) throw err;
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="dw-app dw-auth-screen">
      <div className="dw-auth-inner">
        <div className="dw-auth-logo">downwind</div>
        <p className="dw-auth-tagline">Better. Every single session, big dog.</p>

        <h1 className="dw-auth-heading">
          {isSignUp ? "Create Account" : "Sign In"}
        </h1>

        <form className="dw-auth-form" onSubmit={handleSubmit}>
          <label className="dw-auth-label">
            <span className="dw-auth-label-text">Email</span>
            <input
              className="dw-auth-input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
            />
          </label>
          <label className="dw-auth-label">
            <span className="dw-auth-label-text">Password</span>
            <input
              className="dw-auth-input"
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
              minLength={6}
            />
          </label>

          {error ? (
            <p className="dw-status dw-status--error dw-auth-error">{error}</p>
          ) : null}

          <button
            type="submit"
            className="dw-auth-submit"
            disabled={busy}
          >
            {busy ? "Please wait…" : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <button
          type="button"
          className="dw-auth-toggle"
          onClick={() => {
            setMode(isSignUp ? "signin" : "signup");
            setError("");
          }}
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Need an account? Create one"}
        </button>
      </div>
    </div>
  );
}
