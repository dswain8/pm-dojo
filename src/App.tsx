import { Outlet, Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/review", label: "Review" },
  { to: "/practice", label: "Practice" },
  { to: "/progress", label: "Progress" },
];

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-dojo-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/"
            className="inline-flex items-center hover:opacity-80 transition-opacity"
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
                  className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
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
