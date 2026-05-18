import { expect, test } from '@playwright/test'

const APP_URL = 'http://127.0.0.1:8767/'

async function reset(page: import('@playwright/test').Page) {
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'domcontentloaded' })
}

test.describe('pm dojo product QA', () => {
  test('all primary screens render without console errors', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text())
      }
    })
    page.on('pageerror', (error) => consoleErrors.push(error.message))

    await reset(page)
    await expect(page.getByRole('button', { name: /REVIEW REAL WORK/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /TRAIN A LANE/i })).toBeVisible()
    await expect(page.getByText('LENNY DATASET BUILD')).toBeVisible()
    await expect(page.getByText('SOURCE BOUNDARY')).toBeVisible()
    await expect(page.getByRole('button', { name: /START SUGGESTED REP/i })).toHaveCount(0)
    await expect(page.getByRole('button', { name: /DIRECT DRAFT REVIEW/i })).toHaveCount(0)
    await expect(page.getByRole('button', { name: '? MANUAL' })).toHaveCount(0)
    await expect(page.getByText('DAILY')).toHaveCount(0)
    await expect(page.getByText('STREAK')).toHaveCount(0)
    await expect(page.getByText('RANK')).toHaveCount(0)
    await expect(page.getByText('XP')).toHaveCount(0)

    await page.getByRole('button', { name: 'VIEW BUILDATHON DEMO' }).click()
    await expect(page.getByText('BUILDATHON DEMO MODE')).toBeVisible()
    await expect(page.getByText("From Lenny's archive to PM judgment reps.")).toBeVisible()
    await expect(page.getByRole('button', { name: 'RUN DEMO CRITIQUE' })).toBeVisible()
    await page.getByRole('button', { name: 'Home', exact: true }).click()
    await expect(page.getByRole('button', { name: /REVIEW REAL WORK/i })).toBeVisible()

    await page.goto(`${APP_URL}demo`, { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('BUILDATHON DEMO MODE')).toBeVisible()
    await page.getByRole('button', { name: 'RUN DEMO CRITIQUE' }).click()
    await expect(page.getByText('LIVE CRITIQUE')).toBeVisible()
    await expect(page.getByText('SOURCE LINEAGE')).toBeVisible()
    await page.getByRole('button', { name: 'END ROUND' }).click()
    await page.evaluate(() => localStorage.clear())
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('button', { name: /REVIEW REAL WORK/i })).toBeVisible()

    await page.keyboard.press('m')
    await expect(page.getByText("How Lenny's archive becomes reps.")).toBeVisible()
    await expect(page.getByText('LENNY SOURCE BOUNDARY')).toBeVisible()
    await expect(page.getByText('100/100')).toBeVisible()

    await page.getByRole('button', { name: 'Train', exact: true }).click()
    await expect(page.getByText('5 LANES · 100 SCENARIOS · 1 BOSS')).toBeVisible()
    await expect(page.getByText('SUGGESTED NEXT REP')).toBeVisible()
    await expect(page.getByText('LENNY SOURCE').first()).toBeVisible()

    await page.getByRole('button', { name: 'Home', exact: true }).click()
    await page.getByRole('button', { name: /REVIEW REAL WORK/i }).click()
    await expect(page.getByText('Paste the thing you are about to send.')).toBeVisible()
    await expect(page.getByText('Needs more context')).toBeVisible()
    await page.getByRole('button', { name: 'USE EXAMPLE' }).click()
    await expect(page.getByText('Ready to review')).toBeVisible()
    await page.getByRole('button', { name: 'REVIEW BEFORE SEND' }).click()
    await expect(page.getByText('LIVE CRITIQUE')).toBeVisible()
    await expect(page.getByText(/SHIP IT|REVISE FIRST|DO NOT SEND YET/).first()).toBeVisible()
    await expect(page.getByText('WHAT LANDED')).toBeVisible()
    await expect(page.getByText('WHAT MISSED')).toBeVisible()
    await expect(page.getByText('REVISED DRAFT', { exact: true })).toBeVisible()
    await expect(page.getByText('WHY THIS REVISION WORKS')).toBeVisible()
    await expect(page.getByRole('button', { name: /COPY REVISED DRAFT|COPIED/ })).toBeVisible()
    await page.getByRole('button', { name: 'END ROUND' }).click()

    await page.getByRole('button', { name: 'Train', exact: true }).click()
    await page.getByRole('button').filter({ hasText: 'Pressure-Test' }).click()
    await expect(page.getByText(/LANE 05 · PRESSURE-TEST/i)).toBeVisible()
    await expect(page.getByText('LENNY SOURCES')).toBeVisible()
    await page.getByRole('button', { name: 'USE STARTER DRAFT' }).click()
    await page.getByRole('button', { name: /SUBMIT/i }).click()
    await expect(page.getByText('LIVE CRITIQUE')).toBeVisible()
    await expect(page.getByText('WHAT LANDED')).toBeVisible()
    await expect(page.getByText('WHAT MISSED')).toBeVisible()
    await expect(page.getByText('REVISED DRAFT', { exact: true })).toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test('each lane can open, submit, and persist one round', async ({ page }) => {
    await reset(page)
    const laneNames = ['Bad-News Update', 'Navigate the Room', 'The Cutline', 'Loop the Boss', 'Pressure-Test']

    for (const laneName of laneNames) {
      await page.getByRole('button', { name: 'Train', exact: true }).click()
      await page.getByRole('button').filter({ hasText: laneName }).click()
      await expect(page.locator('textarea')).toBeVisible()
      await expect(page.locator('textarea')).toHaveValue('')
      await page.getByRole('button', { name: 'USE STARTER DRAFT' }).click()
      await page.getByRole('button', { name: /SUBMIT/i }).click()
      await expect(page.getByText('LIVE CRITIQUE')).toBeVisible()
      await page.getByRole('button', { name: 'END ROUND' }).click()
      await expect(page.getByRole('button', { name: /REVIEW REAL WORK/i })).toBeVisible()
    }

    const stats = await page.evaluate(() => JSON.parse(localStorage.getItem('pmdojo-state')!).stats)
    expect(stats.rounds).toBe(5)
    expect(stats.dailyDone).toBeGreaterThanOrEqual(3)
  })

  test('keyboard shortcuts route to the expected screens', async ({ page }) => {
    await reset(page)

    await page.keyboard.press('m')
    await expect(page.getByText('LENNY SOURCE MANUAL')).toBeVisible()

    await page.keyboard.press('b')
    await expect(page.getByText('BUILDATHON DEMO MODE')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: /REVIEW REAL WORK/i })).toBeVisible()

    await page.keyboard.press('g')
    await expect(page.getByText('Your practice')).toBeVisible()

    await page.keyboard.press('Escape')
    await page.keyboard.press('i')
    await expect(page.getByText('Paste the thing you are about to send.')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: /REVIEW REAL WORK/i })).toBeVisible()
    await page.keyboard.press('d')
    await expect(page.getByText('Paste the thing you are about to send.')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: /REVIEW REAL WORK/i })).toBeVisible()
    await page.keyboard.press('Space')
    await expect(page.getByText('Paste the thing you are about to send.')).toBeVisible()
  })

  test('practice draft requires substance before it scores well', async ({ page }) => {
    await reset(page)

    await page.getByRole('button', { name: /REVIEW REAL WORK/i }).click()
    await expect(page.getByText('Needs more context')).toBeVisible()
    await page.getByRole('button', { name: 'REVIEW BEFORE SEND' }).click()
    await expect(page.getByText(/Paste the draft/i)).toBeVisible()

    await page.getByPlaceholder('Who needs to decide or act?').fill('VP Product, support lead, eng owner')
    await page
      .getByPlaceholder(/What happened/i)
      .fill('The launch note is ready, but support found three renewal customers will see invoice deltas they cannot yet explain.')
    await page.getByPlaceholder(/Paste the Slack reply/i).fill(`Rec: pause launch and send the corrected billing note first.

Evidence: Support cannot explain the invoice delta yet and three renewal customers are affected.

Tradeoff: we lose one launch week, but avoid a customer note we may need to unwind.

Need @maya to approve the note by EOD and @devon to confirm the customer list by 3pm.`)
    await page.getByPlaceholder('What are you recommending or asking for?').fill('Pause launch and send the corrected billing note first.')
    await page.getByRole('button', { name: 'ADD EVIDENCE / TRADEOFF / ASK' }).click()
    await page.getByPlaceholder('What are you not promising?').fill('Do not send the current launch note yet.')
    await page.getByPlaceholder('What fact makes this call reasonable?').fill(
      'Support cannot explain the invoice delta, and three renewal customers are affected.',
    )
    await page.getByPlaceholder('What cost or risk are you accepting?').fill(
      'We lose one launch week, but avoid a customer note we may need to unwind.',
    )
    await page.getByPlaceholder('Who needs to decide or act by when?').fill(
      '@maya approves the customer note by EOD; @devon confirms the customer list by 3pm.',
    )
    await page.getByPlaceholder('What would change the call?').fill(
      'If Support can explain the deltas and Billing confirms the note is accurate, ship the note.',
    )
    await expect(page.getByText('Ready to review')).toBeVisible()
    await page.getByRole('button', { name: 'REVIEW BEFORE SEND' }).click()
    await expect(page.getByText('LIVE CRITIQUE')).toBeVisible()
    await expect(page.getByText('Suggested rewrite')).toBeVisible()
    await page.getByRole('button', { name: 'LOG OUTCOME' }).click()
    await expect(page.getByText('OUTCOME REPLAY')).toBeVisible()
    await page.getByPlaceholder('What did the reader do, ask, approve, block, or misunderstand?').fill(
      'VP Product approved the pause, support asked for the customer-safe wording, and eng committed to the impacted list by 3pm.',
    )
    await page.getByPlaceholder('What did you not predict about the reaction?').fill(
      'Support cared more about customer-safe language than the launch timing.',
    )
    await page.getByPlaceholder('What should future-you do differently?').fill(
      'Bring support wording into the first recommendation when billing trust is the real risk.',
    )
    await page.getByPlaceholder('What will you send, ask, escalate, or decide next?').fill(
      'Send the revised customer note and ask Maya to approve it before EOD.',
    )
    await expect(page.getByText('GOOD REPLAY')).toBeVisible()
    await page.getByRole('button', { name: /SAVE REPLAY/i }).click()
    await expect(page.getByText('OUTCOME REPLAYS')).toBeVisible()
    await expect(page.getByText('PATTERN TO CARRY')).toBeVisible()
    const history = await page.evaluate(() => JSON.parse(localStorage.getItem('pmdojo-state')!).history)
    expect(history[0].outcome.label).toBe('GOOD REPLAY')
  })

  test('mobile viewport does not horizontally overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await reset(page)

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(4)
  })
})
