export const DAILY_REP_TARGET = 3
export const SEASON_LABEL = 'Season 1'

export const RANK_LADDER = [
  {
    rank: 'DAN 1',
    minXp: 1100,
    meaning: 'Black-belt judgment: consistently senior, concise, and decision-safe.',
  },
  {
    rank: 'KYŪ 1',
    minXp: 900,
    meaning: 'Promotion-ready: strong under ambiguity, light coaching needed.',
  },
  {
    rank: 'KYŪ 2',
    minXp: 700,
    meaning: 'Advanced: usually makes the call and names the tradeoff.',
  },
  {
    rank: 'KYŪ 3',
    minXp: 500,
    meaning: 'Reliable: clear artifacts, occasional misses under pressure.',
  },
  {
    rank: 'KYŪ 4',
    minXp: 300,
    meaning: 'Practicing: good instincts, still building repeatability.',
  },
  {
    rank: 'KYŪ 5',
    minXp: 180,
    meaning: 'Early rhythm: can hit the obvious beats with support.',
  },
  {
    rank: 'KYŪ 6',
    minXp: 0,
    meaning: 'Beginner rank: learning the core PM writing moves.',
  },
]

export function rankForXp(xp: number) {
  return RANK_LADDER.find((rank) => xp >= rank.minXp)?.rank ?? 'KYŪ 6'
}

export function getNextRankProgress(xp: number) {
  const ascending = [...RANK_LADDER].sort((left, right) => left.minXp - right.minXp)
  const currentIndex = ascending.findIndex((entry, index) => {
    const next = ascending[index + 1]
    return xp >= entry.minXp && (!next || xp < next.minXp)
  })
  const current = ascending[currentIndex] ?? ascending[0]
  const next = ascending[currentIndex + 1] ?? null

  return {
    current,
    next,
    xpToNext: next ? Math.max(0, next.minXp - xp) : 0,
    progress: next ? Math.min(1, (xp - current.minXp) / Math.max(1, next.minXp - current.minXp)) : 1,
  }
}
