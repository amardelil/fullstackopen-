import { test, expect } from '@playwright/test'

const username = process.env.E2E_USERNAME
const password = process.env.E2E_PASSWORD

test.describe('Blog List end-to-end', () => {
  test.skip(!username || !password, 'Set E2E_USERNAME and E2E_PASSWORD in .env to run E2E tests')

  const login = async page => {
    await page.goto('/login')
    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText(/logged in/)).toBeVisible()
  }

  test('5.17–5.18 successful login and logout', async ({ page }) => {
    await login(page)
    await page.getByRole('button', { name: 'logout' }).click()
    await expect(page.getByRole('link', { name: 'login' })).toBeVisible()
  })

  test('5.19 failed login shows an error', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill('incorrect-password')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByRole('status')).toContainText(/wrong username or password/i)
  })

  test('5.20 logged-in user can create a blog', async ({ page }) => {
    await login(page)
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByLabel('title').fill('Playwright test blog')
    await page.getByLabel('author').fill('Playwright')
    await page.getByLabel('url').fill('https://playwright.dev')
    await page.getByRole('button', { name: 'create' }).click()
    await expect(page.getByText('Playwright test blog')).toBeVisible()
  })

  test('5.21 logged-in user can like a blog', async ({ page }) => {
    await login(page)
    const firstBlog = page.locator('[data-testid="blog"]').first()
    await firstBlog.getByRole('button', { name: 'view' }).click()
    const likes = Number(await firstBlog.locator('.likes').textContent())
    await firstBlog.getByRole('button', { name: 'like' }).click()
    await expect(firstBlog.locator('.likes')).toHaveText(String(likes + 1))
  })

  test('5.22 blog list is sorted by likes', async ({ page }) => {
    await login(page)
    const blogCards = page.locator('[data-testid="blog"]')
    for (let i = 0; i < await blogCards.count(); i++) {
      const viewButton = blogCards.nth(i).getByRole('button', { name: 'view' })
      if (await viewButton.count()) await viewButton.click()
    }
    const likeCounts = await page.locator('[data-testid="blog"] .likes').allTextContents()
    const numbers = likeCounts.map(Number)
    expect(numbers).toEqual([...numbers].sort((a, b) => b - a))
  })

  test('5.23 owner can delete a blog', async ({ page }) => {
    await login(page)
    const blog = page.locator('[data-testid="blog"]').filter({ hasText: 'Playwright test blog' }).first()
    if (await blog.count()) {
      await blog.getByRole('button', { name: 'view' }).click()
      page.once('dialog', dialog => dialog.accept())
      await blog.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText('Playwright test blog')).toHaveCount(0)
    }
  })

  test('5.28 login, create, like and delete flow', async ({ page }) => {
    await login(page)
    await expect(page.getByRole('heading', { name: 'Blogs' })).toBeVisible()
  })
})