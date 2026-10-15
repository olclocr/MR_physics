// Reproduce from the repository root with the Playwright CLI run-code --filename option.
async (page) => {
  const root = 'http://127.0.0.1:8766/docs/verification/2026-10-14/';
  const evidence = 'docs/verification/2026-10-15/';
  const results = [];
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const [width, height] of [[1920, 1080], [390, 844]]) {
    await page.setViewportSize({width, height});
    for (const report of ['index', 'original-review', 'fix-validation', 'contrast-chapter']) {
      await page.goto(root + report + '.html');
      for (const img of await page.locator('img').all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(image => image.decode());
      }
      const metrics = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        tables: document.querySelectorAll('table').length,
        images: [...document.images].map(image => ({src: image.getAttribute('src'), loaded: image.naturalWidth > 0})),
        nav: [...document.querySelectorAll('nav a')].map(a => ({label: a.textContent, href: a.getAttribute('href')}))
      }));
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({path: evidence + report + '-' + width + '.png'});
      if (report === 'original-review') {
        await page.locator('table').first().scrollIntoViewIfNeeded();
        await page.screenshot({path: evidence + 'original-table-' + width + '.png'});
      }
      if (report === 'fix-validation') {
        await page.locator('img').first().scrollIntoViewIfNeeded();
        await page.screenshot({path: evidence + 'report-image-' + width + '.png'});
      }
      results.push({report, viewport: {width, height}, ...metrics});
    }
    // Real link activation and keyboard focus/Enter use the same navigation at both sizes.
    await page.getByRole('link', {name: '수정 후 검산', exact: true}).click();
    const clicked = page.url();
    await page.getByRole('link', {name: 'C01 구현 검증', exact: true}).focus();
    await page.keyboard.press('Enter');
    await page.waitForURL(root + 'contrast-chapter.html');
    results.push({viewport: {width, height}, clicked, keyboardDestination: page.url()});
  }
  return {browser: page.context().browser().version(), results, errors};
}
