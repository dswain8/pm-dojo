import type { FeedbackItem } from "./scoring";

export interface SessionScore {
  mode:
    | "review-real-work"
    | "inbox-fire"
    | "red-pen"
    | "first-principles"
    | "the-room";
  scenarioId: string;
  scenarioTitle: string;
  difficulty: string;
  scores: {
    clarity?: number;
    strategy?: number;
    substance?: number;
    total?: number;
    // the-room tracks different axes
    trust?: number;
    effectiveness?: number;
  };
  feedback?: FeedbackItem[];
  coachPunch?: string;
  userResponse?: string;
  timestamp: number;
}

const STORAGE_KEY = "pm-dojo-sessions";

export function getSessions(): SessionScore[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveSession(session: SessionScore) {
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function getStreak(): number {
  const sessions = getSessions();
  if (sessions.length === 0) return 0;

  const days = new Set(
    sessions.map((s) => new Date(s.timestamp).toDateString()),
  );
  const today = new Date();
  let streak = 0;

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (days.has(d.toDateString())) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
}

export function getTotalRounds(): number {
  return getSessions().length;
}
