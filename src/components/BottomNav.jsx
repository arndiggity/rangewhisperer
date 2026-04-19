/**
 * Fixed bottom tab bar. Placeholder tabs (Programmes, My Golf) switch views in App.
 */
export function BottomNav({ active, onSelect }) {
  return (
    <nav className="dw-bottom-nav" aria-label="Main">
      <button
        type="button"
        className={`dw-nav-item${active === "coach" ? " dw-nav-item--active" : ""}`}
        onClick={() => onSelect("coach")}
      >
        <svg
          className="dw-nav-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
        </svg>
        <span className="dw-nav-label">Coach</span>
      </button>
      <button
        type="button"
        className={`dw-nav-item${active === "programmes" ? " dw-nav-item--active" : ""}`}
        onClick={() => onSelect("programmes")}
      >
        <svg
          className="dw-nav-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span className="dw-nav-label">Programmes</span>
      </button>
      <button
        type="button"
        className={`dw-nav-item${active === "my-golf" ? " dw-nav-item--active" : ""}`}
        onClick={() => onSelect("my-golf")}
      >
        <svg
          className="dw-nav-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
        <span className="dw-nav-label">My Golf</span>
      </button>
    </nav>
  );
}
