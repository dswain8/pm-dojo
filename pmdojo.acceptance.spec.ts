import { expect, test } from '@playwright/test'

function expectedGrade(xp: number) {
  if (xp >= 80) return 'S'
  if (xp >= 65) return 'A'
  if (xp >= 50) return 'B'
  if (xp >= 35) return 'C'
  return 'D'
}

function radarPoints(values: number[]) {
  const cx = 160
  const cy = 135
  const r = 92
  return values
    .map((value, index) => {
      const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 5
      return [cx + Math.cos(angle) * r * value, cy + Math.sin(angle) * r * value].join(',')
    })
    .join(' ')
}

test('pm dojo acceptance', async ({ page }) => {
  test.setTimeout(60_000)

  await page.addInitScript(() => {
    const realSetInterval = window.setInterval.bind(window)
    window.setInterval = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
      return realSetInterval(handler, timeout === 1000 ? 10 : timeout, ...args)
    }) as typeof window.setInterval
  })

  await page.goto('http://127.0.0.1:8767/', { waitUntil: 'networkidle' })
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'networkidle' })

  const startButton = page.getByRole('button', { name: /REVIEW REAL WORK/i })
  await expect(startButton).toBeVisible()
  await expect(page.getByRole('button', { name: /TRAIN A LANE/i })).toBeVisible()
  await expect(page.getByText('LENNY DATASET BUILD')).toBeVisible()
  await expect(page.getByText("Lenny's Newsletter + Podcast archive")).toBeVisible()
  await expect(page.getByRole('button', { name: /START SUGGESTED REP/i })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /DIRECT DRAFT REVIEW/i })).toHaveCount(0)
  await expect(page.getByRole('button', { name: '? MANUAL' })).toHaveCount(0)
  await expect(page.getByText('DAILY')).toHaveCount(0)
  await expect(page.getByText('STREAK')).toHaveCount(0)
  await expect(page.getByText('RANK')).toHaveCount(0)
  await expect(page.getByText('XP')).toHaveCount(0)
  await expect.poll(() => startButton.evaluate((el) => getComputedStyle(el).animationName)).toContain('glow')

  await page.getByRole('button', { name: 'VIEW BUILDATHON DEMO' }).click()
  await expect(page.getByText('BUILDATHON DEMO MODE')).toBeVisible()
  await expect(page.getByText("From Lenny's archive to PM judgment reps.")).toBeVisible()
  await expect(page.getByText('1 · SOURCE')).toBeVisible()
  await expect(page.getByText('BUILDATHON READINESS')).toBeVisible()
  await page.getByRole('button', { name: 'RUN DEMO CRITIQUE' }).click()
  await expect(page.getByText('LIVE CRITIQUE')).toBeVisible()
  await expect(page.getByText('SOURCE LINEAGE')).toBeVisible()
  await expect(page.getByText('REVISED DRAFT', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'END ROUND' }).click()
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'networkidle' })
  await expect(startButton).toBeVisible()

  await page.keyboard.press('m')
  await expect(page.getByText('LENNY SOURCE MANUAL')).toBeVisible()
  await expect(page.getByText("How Lenny's archive becomes reps.")).toBeVisible()
  await expect(page.getByText('LENNY SOURCE BOUNDARY')).toBeVisible()
  await expect(page.getByText('SCORING CONTRACT')).toBeVisible()
  await expect(page.getByText('SCENARIO REPOSITORY')).toBeVisible()
  await expect(page.getByText('100/100')).toBeVisible()
  await page.getByRole('button', { name: 'Home', exact: true }).click()
  await expect(startButton).toBeVisible()

  await startButton.click()
  await expect(page.getByText('Paste the thing you are about to send.')).toBeVisible()
  await expect(page.getByText('Needs more context')).toBeVisible()
  await page.getByRole('button', { name: 'USE EXAMPLE' }).click()
  await expect(page.getByText('Ready to review')).toBeVisible()
  await page.getByRole('button', { name: 'REVIEW BEFORE SEND' }).click()
  await expect(page.getByText('LIVE CRITIQUE')).toBeVisible()
  await expect(page.getByText('WHAT LANDED')).toBeVisible()
  await expect(page.getByText('WHAT MISSED')).toBeVisible()
  await expect(page.getByText('REVISED DRAFT', { exact: true })).toBeVisible()
  await expect(page.getByText('WHY THIS REVISION WORKS')).toBeVisible()
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'networkidle' })
  await expect(startButton).toBeVisible()

  await page.getByRole('button', { name: 'Train', exact: true }).click()
  await expect(page.getByText('Train').first()).toBeVisible()
  await expect(page.getByText('5 LANES · 100 SCENARIOS · 1 BOSS')).toBeVisible()
  await expect(page.getByText('SUGGESTED NEXT REP')).toBeVisible()
  await expect(page.getByText('LENNY SOURCE').first()).toBeVisible()
  await expect(page.getByText('Pressure-Test')).toBeVisible()
  await page.getByRole('button').filter({ hasText: 'Navigate the Room' }).click()
  await expect(page.getByText('#roadmap-staff · follow-up')).toBeVisible()
  await expect(page.getByText('LENNY SOURCES')).toBeVisible()
  await expect(page.locator('textarea')).toHaveValue('')
  await page.getByRole('button', { name: '← exit' }).click()
  await expect(startButton).toBeVisible()

  await page.getByRole('button', { name: 'Home', exact: true }).click()
  await expect(startButton).toBeVisible()
  await startButton.click()
  await expect(page.getByText('Needs more context')).toBeVisible()
  await page.getByPlaceholder('Who needs to decide or act?').fill('VP Product, support lead, eng owner')
  await page.getByPlaceholder(/What happened/i).fill(
    'The launch note is ready, but support found three renewal customers will see invoice deltas they cannot yet explain.',
  )
  await page.getByPlaceholder(/Paste the Slack reply/i).fill(`Rec: pause the launch by Friday and send customers the corrected billing note first.

Evidence: the current draft creates billing-trust risk because support cannot yet explain the invoice delta.

Tradeoff: we lose one launch week, but avoid sending a note we may need to unwind.

Need @maya to approve the customer note by EOD.`)
  await page.getByPlaceholder('What are you recommending or asking for?').fill(
    'Pause the launch by Friday and send customers the corrected billing note first.',
  )
  await page.getByRole('button', { name: 'ADD EVIDENCE / TRADEOFF / ASK' }).click()
  await page.getByPlaceholder('What fact makes this call reasonable?').fill(
    'Support cannot explain the invoice delta, and three renewal customers are affected.',
  )
  await page.getByPlaceholder('What cost or risk are you accepting?').fill(
    'We lose one launch week, but avoid sending a note we may need to unwind.',
  )
  await page.getByPlaceholder('Who needs to decide or act by when?').fill('@maya approves the customer note by EOD.')
  await page.getByPlaceholder('What are you not promising?').fill('Do not send the current launch note yet.')
  await page.getByPlaceholder('What would change the call?').fill('If Support can explain the invoice deltas, ship the note.')
  await expect(page.getByText('Ready to review')).toBeVisible()
  await page.getByRole('button', { name: 'REVIEW BEFORE SEND' }).click()
  await expect(page.getByText('Suggested rewrite')).toBeVisible()
  await expect(page.getByText('LIVE CRITIQUE')).toBeVisible()
  await expect(page.getByRole('button', { name: /COPY REVISED DRAFT|COPIED/ })).toBeVisible()
  await page.getByRole('button', { name: 'END ROUND' }).click()
  await expect(startButton).toBeVisible()
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'networkidle' })
  await expect(startButton).toBeVisible()

  await page.keyboard.press('Space')
  await expect(page.getByText('Paste the thing you are about to send.')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(startButton).toBeVisible()

  await page.getByRole('button', { name: 'Train', exact: true }).click()
  await page.getByRole('button').filter({ hasText: 'Bad-News Update' }).click()
  await expect(page.getByText(/LANE 01 · BAD-NEWS UPDATE/i)).toBeVisible()
  const timerBefore = await page.locator('text=/\\d\\d:\\d\\d/').first().textContent()
  await page.waitForTimeout(50)
  const timerAfter = await page.locator('text=/\\d\\d:\\d\\d/').first().textContent()
  expect(timerAfter).not.toBe(timerBefore)
  await page.waitForTimeout(4300)
  await expect(page.locator('svg circle').nth(1)).toHaveAttribute('stroke', '#ff5b3a')
  await page.getByRole('button', { name: '← exit' }).click()
  await expect(startButton).toBeVisible()

  await page.reload({ waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Train', exact: true }).click()
  await page.getByRole('button').filter({ hasText: 'Bad-News Update' }).click()
  await expect(page.getByText(/LANE 01 · BAD-NEWS UPDATE/i)).toBeVisible()
  const textarea = page.locator('textarea')
  await textarea.fill('hello')
  await page.waitForTimeout(50)
  const lowXp = Number((await page.locator('text=/\\+[0-9]+/').first().textContent())!.replace('+', ''))
  await textarea.fill('rec: ship 5x by thursday, reply by 2pm, renewal is at risk, 3 day migration hit, $240k ARR, @sahar feasibility, @derek precedent')
  await page.waitForTimeout(50)
  const highXp = Number((await page.locator('text=/\\+[0-9]+/').first().textContent())!.replace('+', ''))
  expect(highXp).toBeGreaterThan(lowXp)
  await textarea.fill(Array.from({ length: 121 }, (_, index) => `word${index + 1}`).join(' '))
  await page.waitForTimeout(50)
  await expect(page.locator('span').filter({ hasText: /^121$/ }).first()).toHaveCSS('color', 'rgb(255, 91, 58)')

  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Train', exact: true }).click()
  await page.getByRole('button').filter({ hasText: 'Bad-News Update' }).click()
  await expect(page.getByText(/LANE 01 · BAD-NEWS UPDATE/i)).toBeVisible()
  await expect(page.getByRole('button', { name: /SUBMIT/i })).toBeDisabled()
  const projectedXp = Number((await page.locator('text=/\\+[0-9]+/').first().textContent())!.replace('+', ''))
  expect(projectedXp).toBe(0)
  await page.getByRole('button', { name: 'USE STARTER DRAFT' }).click()
  await expect(page.locator('text=/\\+[5-9][0-9]|\\+100/').first()).toBeVisible()
  const starterXp = Number((await page.locator('text=/\\+[0-9]+/').first().textContent())!.replace('+', ''))
  await page.getByRole('button', { name: /SUBMIT/i }).click()
  await expect(page.getByText('LIVE CRITIQUE')).toBeVisible()
  await expect(page.getByText('WHAT LANDED')).toBeVisible()
  await expect(page.getByText('WHAT MISSED')).toBeVisible()
  const grade = (await page.locator('text=/^[SABCD]$/').first().textContent())!.trim()
  expect(grade).toBe(expectedGrade(starterXp))
  await expect(page.getByText('Your draft')).toBeVisible()
  await expect(page.getByText('Suggested rewrite')).toBeVisible()
  await expect(page.getByText('WHY THIS REVISION WORKS')).toBeVisible()

  await page.getByRole('button', { name: 'END ROUND' }).click()
  await expect(startButton).toBeVisible()
  const afterFirstRound = await page.evaluate(() => JSON.parse(localStorage.getItem('pmdojo-state')!).stats)
  expect(afterFirstRound.rounds).toBe(1)
  expect(afterFirstRound.dailyDone).toBe(1)
  expect(afterFirstRound.streak).toBe(1)
  expect(afterFirstRound.xp).toBe(starterXp)
  await expect(page.getByText('1/3')).toHaveCount(0)

  await page.keyboard.press('g')
  await expect(page.getByText('Your practice')).toBeVisible()
  await expect(page.getByText('1/3').first()).toBeVisible()
  await expect(page.getByText('1d').first()).toBeVisible()
  await expect(page.getByText(String(starterXp)).first()).toBeVisible()
  const progressStats = await page.evaluate(() => JSON.parse(localStorage.getItem('pmdojo-state')!).stats)
  const progressPolygon = await page.locator('svg').first().locator('polygon').nth(5).getAttribute('points')
  expect(progressPolygon).toBe(radarPoints(progressStats.radar))
  const expectedHotDays = await page.evaluate(() => {
    const history = JSON.parse(localStorage.getItem('pmdojo-state')!).history as Array<{ submittedAt: string }>
    const seen = new Set(
      history.map((run) => {
        const date = new Date(run.submittedAt)
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      }),
    )
    return seen.size
  })
  const hotCells = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div')).filter((element) => {
      const style = getComputedStyle(element)
      return style.height === '22px' && style.backgroundColor === 'rgb(255, 91, 58)'
    }).length
  })
  expect(hotCells).toBe(expectedHotDays)
  await page.keyboard.press('Escape')
  await expect(startButton).toBeVisible()

  await page.reload({ waitUntil: 'networkidle' })
  await expect(startButton).toBeVisible()
  await expect(page.getByText('1/3')).toHaveCount(0)
  await page.getByRole('button', { name: 'Progress', exact: true }).click()
  await expect(page.getByText('1/3').first()).toBeVisible()
  await expect(page.getByText('1d').first()).toBeVisible()
  await expect(page.getByText(String(starterXp)).first()).toBeVisible()
  await page.getByRole('button', { name: 'Home', exact: true }).click()

  await page.getByRole('button', { name: 'TWEAKS' }).click()
  await page.getByRole('button', { name: 'Mint', exact: true }).click()
  await expect(startButton).toHaveCSS('background-color', 'rgb(94, 242, 176)')

  await page.getByRole('button', { name: 'Train', exact: true }).click()
  await page.getByRole('button', { name: 'START REP' }).click()
  await expect(page.getByText('AI invoice summaries · pre-mortem')).toBeVisible()
  await page.getByRole('button', { name: 'USE STARTER DRAFT' }).click()
  await page.getByRole('button', { name: /SUBMIT/i }).click()
  await expect(page.getByText('LIVE CRITIQUE')).toBeVisible()
  await page.getByRole('button', { name: /NEXT ROUND/i }).click()
  await expect(page.getByText('migration wizard · pre-mortem')).toBeVisible()
  const persistedStats = await page.evaluate(() => JSON.parse(localStorage.getItem('pmdojo-state')!).stats)
  expect(persistedStats.rounds).toBe(2)
  expect(persistedStats.streak).toBe(1)
  expect(persistedStats.dailyDone).toBe(2)
})
