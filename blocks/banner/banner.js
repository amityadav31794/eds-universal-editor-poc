export default function decorate(block) {

  // ── READ ROWS ──
  const rows = [...block.children];

  // row 0 → background image (picture element)
  const picture = rows[0]?.querySelector('picture');

  // row 1 → heading
  const headingEl = rows[1]?.querySelector('h2, h3, h4');
  const headingText = headingEl?.textContent?.trim() || '';

  // row 2 → description paragraph
  const descEl = rows[2]?.querySelector('div');
  const descHTML = descEl?.innerHTML || '';

  // ── SET BACKGROUND IMAGE ──
  // use largest srcset from picture for background
  if (picture) {
    const img = picture.querySelector('img');
    const webpSource = picture.querySelector(
      'source[type="image/webp"][media]'
    );

    // get best quality image URL for background
    const bgUrl = webpSource
      ? webpSource.getAttribute('srcset')?.split('?')[0]
      : img?.src?.split('?')[0];

    if (bgUrl) {
      block.style.backgroundImage = `url('${bgUrl}')`;
    }
  }

  // ── BUILD DOM ──
  const inner = document.createElement('div');
  inner.className = 'banner-inner';

  // heading
  if (headingText) {
    const heading = document.createElement('h2');
    heading.className = 'banner-heading';
    heading.textContent = headingText;
    inner.appendChild(heading);
  }

  // description
  if (descHTML) {
    const desc = document.createElement('div');
    desc.className = 'banner-description';
    desc.innerHTML = descHTML;
    inner.appendChild(desc);
  }

  // ── REPLACE BLOCK CONTENT ──
  block.innerHTML = '';
  block.appendChild(inner);
}