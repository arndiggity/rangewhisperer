import { useEffect, useState } from "react";

import { CoachExperience } from "./CoachExperience.jsx";
import { supabase } from "./lib/supabase.js";
import { AuthScreen } from "./screens/AuthScreen.jsx";
import { ProfileSetupScreen } from "./screens/ProfileSetupScreen.jsx";

async function fetchGolferProfile(userId) {
  const { data, error } = await supabase
    .from("golfer_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

function App() {
  const [authReady, setAuthReady] = useState(false);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoadState, setProfileLoadState] = useState("idle");

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session: next } }) => {
      if (!cancelled) {
        setSession(next ?? null);
        setAuthReady(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next ?? null);
      setAuthReady(true);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      setProfile(null);
      setProfileLoadState("idle");
      return;
    }

    let cancelled = false;
    setProfileLoadState("loading");

    fetchGolferProfile(userId)
      .then((row) => {
        if (!cancelled) {
          setProfile(row);
          setProfileLoadState("ready");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProfile(null);
          setProfileLoadState("ready");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  const handleProfileSaved = (row) => {
    setProfile(row);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!authReady) {
    return (
      <div className="dw-app dw-auth-loading">
        <p className="dw-auth-loading-text">Loading…</p>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  if (profileLoadState === "loading") {
    return (
      <div className="dw-app dw-auth-loading">
        <p className="dw-auth-loading-text">Loading…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <ProfileSetupScreen user={session.user} onComplete={handleProfileSaved} />
    );
  }

  return (
    <CoachExperience profile={profile} onSignOut={handleSignOut} />
  );
}

export default App;
