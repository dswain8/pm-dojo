const STOPWORDS = new Set([
  'about',
  'above',
  'after',
  'again',
  'against',
  'already',
  'also',
  'before',
  'being',
  'below',
  'between',
  'because',
  'cannot',
  'could',
  'customer',
  'customers',
  'decision',
  'draft',
  'evidence',
  'external',
  'first',
  'from',
  'have',
  'here',
  'into',
  'just',
  'launch',
  'make',
  'more',
  'need',
  'next',
  'only',
  'product',
  'recommendation',
  'reply',
  'risk',
  'should',
  'stake',
  'stakes',
  'team',
  'their',
  'there',
  'these',
  'thing',
  'this',
  'those',
  'tradeoff',
  'until',
  'update',
  'what',
  'when',
  'where',
  'while',
  'with',
  'without',
  'would',
])

function normalizeTerm(term: string) {
  return term
    .trim()
    .replace(/[“”"'.:,;!?()[\]{}]/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

function hasSpecificShape(raw: string) {
  return /[@$%]|\d/.test(raw) || /^[A-Z][A-Za-z0-9-]{2,}$/.test(raw) || /^[A-Z0-9]{2,}$/.test(raw)
}

function termPriority(raw: string) {
  if (/[@$%]|\d/.test(raw)) {
    return 0
  }

  if (/^[A-Z0-9]{2,}$/.test(raw) || /^[A-Z][A-Za-z0-9-]{2,}$/.test(raw)) {
    return 1
  }

  return 2
}

export function extractImportantTerms(parts: Array<string | string[] | undefined>, limit = 18) {
  const text = parts.flatMap((part) => (Array.isArray(part) ? part : part ? [part] : [])).join('\n')
  const matches = text.match(/@[a-z0-9_]+|\$?\d+(?:[\d,.]*)(?:%|x|k|m|d)?|[A-Z0-9][A-Za-z0-9-]{1,}|[a-z][a-z0-9-]{3,}/g) ?? []
  const seen = new Set<string>()
  const candidates: Array<{ raw: string; term: string; priority: number }> = []

  for (const raw of matches) {
    const term = normalizeTerm(raw)

    if (!term || seen.has(term)) {
      continue
    }

    if (!hasSpecificShape(raw) && (term.length < 5 || STOPWORDS.has(term))) {
      continue
    }

    seen.add(term)
    candidates.push({ raw, term, priority: termPriority(raw) })
  }

  return candidates
    .sort((left, right) => left.priority - right.priority || left.term.length - right.term.length)
    .slice(0, limit)
    .map((candidate) => candidate.term)
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function countImportantTermHits(draft: string, terms: string[]) {
  const lowerDraft = draft.toLowerCase()
  let hits = 0

  for (const term of terms) {
    if (term.startsWith('@')) {
      const withoutMention = term.slice(1)
      if (lowerDraft.includes(term) || lowerDraft.includes(withoutMention)) {
        hits += 1
      }
      continue
    }

    if (/[@$%]|\d|-/.test(term)) {
      if (lowerDraft.includes(term)) {
        hits += 1
      }
      continue
    }

    if (new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i').test(draft)) {
      hits += 1
    }
  }

  return hits
}

export function hasConcreteEvidenceSignal(text: string) {
  return /\$|\b\d+(?:\.\d+)?\s?(?:%|x|k|m|d|days?|hours?|mins?|customers?|users?|accounts?|weeks?|sprints?)?\b|\b(arr|revenue|renewal|churn|invoice|billing|metric|kpi|sla|p95|p0|q[1-4]|deadline|eod|today|tomorrow|friday|monday|tuesday|wednesday|thursday|support|legal|security|ceo|board|incident)\b/i.test(
    text,
  )
}
