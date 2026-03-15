export default async function decorate(block) {

  // ── READ ROWS FROM UE ──
  // 0  = leftBgImage  (reference → img tag)
  // 1  = leftHeading
  // 2  = leftBodyText
  // 3  = leftCtaText
  // 4  = leftCtaUrl
  // 5  = stockCardCode  (kept for future API use)
  // 6  = rightHeading
  // 7  = rightBodyText (richtext → HTML)
  // 8  = rightCtaText
  // 9  = rightCtaUrl

  const rows = [...block.children];

  function getText(i) {
    return rows[i]?.querySelector('div')
      ?.textContent?.trim() || '';
  }

  function getHref(i) {
    return rows[i]?.querySelector('a')?.href
      || getText(i) || '#';
  }

  function getImg(i) {
    return rows[i]?.querySelector('img') || null;
  }

  function getHTML(i) {
    return rows[i]?.querySelector('div')?.innerHTML || '';
  }

  const leftBgImg    = getImg(0);
  const leftHeading  = getText(1);
  const leftBodyText = getText(2);
  const leftCtaText  = getText(3);
  const leftCtaUrl   = getHref(4);
  // const cardCode  = getText(5) || 'ZBH'; // TODO: use for API
  const rightHeading = getText(6);
  const rightHTML    = getHTML(7);
  const rightCtaText = getText(8);
  const rightCtaUrl  = getHref(9);

  // ── BG IMAGE ──
  const leftBgStyle = leftBgImg
    ? `style="background-image: url('${leftBgImg.src}')"`
    : '';

  // ── BUILD HTML ──
  block.innerHTML = `
    <section class="highlights">

      <!-- LEFT COLUMN -->
      <div class="highlights__col highlights__col--dark" ${leftBgStyle}>

        <h2 class="highlights__heading highlights__heading--white">
          ${leftHeading}
        </h2>

        <p class="highlights__text highlights__text--white">
          ${leftBodyText}
        </p>

        <div class="highlights__actions">

          <a class="highlights__btn highlights__btn--tertiary"
             href="${leftCtaUrl}"
             target="_blank"
             rel="noopener noreferrer">
            ${leftCtaText}
            <svg role="img" aria-hidden="true" focusable="false">
              <use xlink:href="#icon-arrow-stem"></use>
            </svg>
          </a>

          <!-- TODO: replace with live API data using cardCode -->
          <div class="stock">
            <span class="stock__label">Stock Price</span>
            <span class="stock__price">$93.20</span>
            <span class="stock__change stock__change--up">
              <svg class="stock__arrow stock__arrow--up">
                <use xlink:href="#icon-up"></use>
              </svg>
              +0.61 (+0.66%)
            </span>
            <p class="stock__updated">
              Updated 01:37 PM EDT on 3/14/26<br>
              Delayed by at least 15 minutes
            </p>
          </div>

        </div>

      </div>

      <!-- RIGHT COLUMN -->
      <div class="highlights__col highlights__col--gradient">

        <h2 class="highlights__heading highlights__heading--dark">
          ${rightHeading}
        </h2>

        <div class="highlights__text highlights__text--white">
          ${rightHTML}
        </div>

        <a class="highlights__btn highlights__btn--secondary"
           href="${rightCtaUrl}"
           target="_blank"
           rel="noopener noreferrer">
          ${rightCtaText}
          <svg role="img" aria-hidden="true" focusable="false">
            <use xlink:href="#icon-arrow-stem"></use>
          </svg>
        </a>

      </div>

    </section>
  `;
}