import { test, expect } from '@playwright/test';
import exp from 'constants';

// const baseUrl = 'https://bie-test.ala.org.au';
const searchUrl = '/search?q=Acacia&rows=20';
const taxonId = 'https://id.biodiversity.org.au/taxon/apni/51471290';
const acaciaUrl = '/species/' + taxonId;

// Needed for BIE WAF on GH actions servers
test.use({ userAgent: 'GH Actions Bot 1.0' });

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
  // await expect(textInput).toHaveValue('https://bie-ws.ala.org.au/ws/species/' + taxonId, { timeout: 5000 });
  await expect(textInput).toHaveValue('https://bie-ws-test.ala.org.au/ws/species/' + taxonId, { timeout: 5000 });
});

test('Acacia Mill - hero images', async ({ page }) => {
  await page.goto(acaciaUrl);
  // page.waitForSelector('.taxon-summary-thumb', { timeout: 30000 });
  const thumbCount = await page.locator('.taxon-summary-thumb').count();
  await expect(thumbCount).toBeGreaterThanOrEqual(2);
  // Check for the thumnail image
  const firstThumb = page.locator('.taxon-summary-thumb').first();
  // Get specific inline property
  const imageUrl = await firstThumb.evaluate((el) => {
    return el.style.backgroundImage;
  });

  expect(imageUrl).toContain('image/proxyImageThumbnail');
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