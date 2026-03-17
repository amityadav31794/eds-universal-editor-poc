export default function decorate(block) {

  const rows = [...block.children];
  const picture = rows[0]?.querySelector('picture');

  const headingEl = rows[1]?.querySelector('h2, h3, h4');
  const headingText = headingEl?.textContent?.trim() || '';

  const descEl = rows[2]?.querySelector('div');
  const descHTML = descEl?.innerHTML || '';

  if (picture) {
    const img = picture.querySelector('img');
    const webpSource = picture.querySelector(
      'source[type="image/webp"][media]'
    );

    const bgUrl = webpSource
      ? webpSource.getAttribute('srcset')?.split('?')[0]
      : img?.src?.split('?')[0];

    if (bgUrl) {
      block.style.backgroundImage = `url('${bgUrl}')`;
    }
  }

  const inner = document.createElement('div');
  inner.className = 'banner-inner';

  if (headingText) {
    const heading = document.createElement('h2');
    heading.className = 'banner-heading';
    heading.textContent = headingText;
    inner.appendChild(heading);
  }

  if (descHTML) {
    const desc = document.createElement('div');
    desc.className = 'banner-description';
    desc.innerHTML = descHTML;
    inner.appendChild(desc);
  }

  block.innerHTML = '';
  block.appendChild(inner);
}