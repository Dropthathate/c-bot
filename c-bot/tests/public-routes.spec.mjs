import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

const publicPages = [
  { path: '/about', heading: 'Documentation support designed for hands-on care.' },
  { path: '/privacy-policy.html', heading: 'Privacy Policy' },
  { path: '/terms-and-conditions.html', heading: 'Terms & Conditions' },
  { path: '/investor-pitch.html', heading: 'THE AI CLINICAL OS THAT THINKS WITH YOU WHILE YOUR HANDS DO THE WORK' },
]

test('landing page routes beta interest to the waitlist and exposes required footer destinations', async ({ page }) => {
  await page.goto('/')

  const betaCta = page.getByRole('link', { name: 'Join Beta — Free' }).first()
  await expect(betaCta).toHaveAttribute('href', '#cta')
  await expect(page.getByLabel('Email address')).toBeVisible()
  await expect(page.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
  await expect(page.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy-policy.html')
  await expect(page.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms-and-conditions.html')
  await expect(page.getByRole('link', { name: 'Member Sign In' })).toHaveAttribute('href', '/login')

  await betaCta.click()
  await expect(page).toHaveURL(/#cta$/)
  await expect(page.getByLabel('Email address')).toBeInViewport()
})

for (const { path, heading } of publicPages) {
  test(`${path} renders page-specific content`, async ({ page }) => {
    await page.goto(path)
    await expect(page).toHaveURL(new RegExp(`${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`))
    await expect(page.getByRole('heading', { name: heading }).first()).toBeVisible()
  })
}

test('member sign-in is invitation-only and keeps authentication routes available', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
  await expect(page.getByText('Beta access is invitation-only.')).toBeVisible()
  await expect(page.getByRole('button', { name: /^Sign in/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Create Account/i })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Join the beta waitlist' })).toHaveAttribute('href', '/#cta')

  await page.goto('/auth')
  await expect(page).toHaveURL(/\/login$/)
})

test('Vercel configuration declares the baseline response security headers', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'))
  const headers = Object.fromEntries(config.headers.flatMap((group) => group.headers.map(({ key, value }) => [key, value])))

  expect(headers['Content-Security-Policy']).toContain("default-src 'self'")
  expect(headers['Content-Security-Policy']).toContain("frame-ancestors 'none'")
  expect(headers['Permissions-Policy']).toContain('camera=()')
  expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
  expect(headers['X-Content-Type-Options']).toBe('nosniff')
  expect(headers['X-Frame-Options']).toBe('DENY')
})
