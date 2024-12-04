import { test, expect } from '@playwright/test';

const searchUrl = 'https://bie-test.ala.org.au/search?q=Acacia&rows=20';
const taxonId = 'https://id.biodiversity.org.au/taxon/apni/51471290';
const acaciaUrl = 'https://bie-test.ala.org.au/species/' + taxonId;

test.use({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });

test('Acacia Mill - names check', async ({ page }) => {
  // Search for Acacia 
  await page.goto(searchUrl);

  // Click the genus page result
  await page.locator('a[href="/species/Acacia"]').nth(1).click();
  await page.waitForSelector('h1 .accepted-name', { timeout: 30000 })
  await expect(page.locator('h1 .accepted-name')).toContainText('Acacia Mill.');
  await expect(page.locator('.language-name').nth(0)).toContainText('Wudjari');
});

test('Acacia Mill - API URL', async ({ page }) => {
  await page.goto(acaciaUrl);
  await page.getByRole('button', { name: 'API' }).click();
  const textInput = await page.locator('#al4rcode');
  await expect(textInput).toHaveValue('https://bie-ws-test.ala.org.au/ws/species/' + taxonId, { timeout: 5000 });
});

test('Acacia Mill - hero images', async ({ page }) => {
  await page.goto(acaciaUrl);
  // page.waitForSelector('.taxon-summary-thumb', { timeout: 30000 });
  const thumbCount = await page.locator('.taxon-summary-thumb').count();
  await expect(thumbCount).toBeGreaterThanOrEqual(2);
  const imageSrc = 'url(\"https://images-test.ala.org.au/image/proxyImageThumbnail?imageId=07bf481a-b8ce-485d-9d32-bfb48c8d4df9\")'
  await expect(page.locator('.taxon-summary-thumb').first()).toHaveCSS('background-image', imageSrc);
});

test('Acacia Mill - Wikipedia content', async ({ page }) => {
  // Taxonomy, Ecology, References
  await page.goto(acaciaUrl);
  await page.waitForSelector('.panel-description', { timeout: 30000 });
  const panelDescriptions = await page.locator('.panel-description');
  const expectedTexts = ['Description', 'Taxonomy', 'Ecology', 'Uses', 'References'];
  for (const text of expectedTexts) {
    await expect(page.getByText(text, { exact: true })).toBeVisible();
  }
});