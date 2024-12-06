import { test, expect } from '@playwright/test';

test('test kangaroo', async ({ page }) => {
  await page.goto('https://bie-test.ala.org.au/');
  await page.getByPlaceholder('Search species, datasets and').click();
  await page.getByPlaceholder('Search species, datasets and').fill('kangaroo');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByText('Osphranter rufus').nth(1)).toBeVisible();
});