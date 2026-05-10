import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/review", label: "Review" },
  { to: "/practice", label: "Practice" },
  { to: "/progress", label: "Progress" },
];

const PRIVACY_BANNER_KEY = "pm-dojo:privacy-banner-dismissed-v1";

export default function App() {
  const location = useLocation();
  const [showPrivacyBanner, setShowPrivacyBanner] = useState(false);

  useEffect(() => {
    setShowPrivacyBanner(localStorage.getItem(PRIVACY_BANNER_KEY) !== "true");
  }, []);

  const dismissPrivacyBanner = () => {
    localStorage.setItem(PRIVACY_BANNER_KEY, "true");
    setShowPrivacyBanner(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showPrivacyBanner && (
        <div className="border-b border-dojo-accent/20 bg-dojo-accent/10 px-6 py-3">
          <div className="max-w-5xl mx-auto flex flex-col gap-3 text-sm text-dojo-text sm:flex-row sm:items-center sm:justify-between">
            <p>
              <span className="font-semibold text-dojo-accent">
                Everything runs in your browser.
              </span>{" "}
              Your drafts never leave this tab — no server, no logging, no LLM calls.
            </p>
            <button
              type="button"
              onClick={dismissPrivacyBanner}
              className="min-h-11 self-start rounded-full border border-dojo-border px-4 py-2 text-xs font-semibold uppercase tracking-wider text-dojo-muted transition-colors hover:border-dojo-accent hover:text-dojo-accent sm:self-center"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      <header className="border-b border-dojo-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center hover:opacity-80 transition-opacity"
          >
            <span className="text-lg font-bold tracking-widest uppercase text-dojo-accent">
              PM Dojo
            </span>
          </Link>
          <nav className="flex flex-wrap gap-2 sm:gap-4">
            {NAV_ITEMS.map((item) => {
              const active =
                item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`inline-flex min-h-11 items-center rounded-full px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-dojo-card text-dojo-accent"
                      : "text-dojo-muted hover:text-dojo-text"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
