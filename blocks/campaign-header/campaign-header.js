// V1 — icon logo + back link only
// No variant field — this IS v1

async function initHeadroom(block) {
  try {
    const { default: Headroom } = await import(
      'https://cdnjs.cloudflare.com/ajax/libs/headroom/0.12.0/headroom.esm.min.js'
    );
    const tolerance = document.querySelector('.hero-jump-links__sticky')
      ? 200000
      : 1000;
    new Headroom(block, { tolerance }).init();
  } catch (e) {
    console.warn('Headroom failed to load', e);
  }
}

function handleResponsive(block, backLinkCol, logoCol) {
  const mq = window.matchMedia('(max-width: 768px)');

  function onChange(e) {
    if (!backLinkCol || !logoCol) return;

    if (e.matches) {
      // mobile
      backLinkCol.classList.replace(
        'grid__col-size-4', 'grid__col-size-6'
      );
      logoCol.classList.replace(
        'grid__col-size-4', 'grid__col-size-6'
      );
      logoCol.classList.replace(
        'grid__col-position-5', 'grid__col-position-7'
      );
      logoCol.classList.add('flex--justify-content-end');
      block.querySelector(
        '.campaign-template-header--back__text'
      )?.classList.add('hide');

    } else {
      // desktop
      backLinkCol.classList.replace(
        'grid__col-size-6', 'grid__col-size-4'
      );
      logoCol.classList.replace(
        'grid__col-size-6', 'grid__col-size-4'
      );
      logoCol.classList.replace(
        'grid__col-position-7', 'grid__col-position-5'
      );
      logoCol.classList.remove('flex--justify-content-end');
      block.querySelector(
        '.campaign-template-header--back__text'
      )?.classList.remove('hide');
    }
  }

  mq.addEventListener('change', onChange);
  onChange(mq);
}

export default async function decorate(block) {

  // V1 model field order (no variant row):
  // 0 = linkText
  // 1 = urlLinkPath
  // 2 = logoLinkPath
  // 3 = openInNewTab

  const rows = [...block.children];

  function getRowText(i) {
    return rows[i]?.querySelector('div')
      ?.textContent?.trim() || '';
  }

  function getRowHref(i) {
    return rows[i]?.querySelector('a')?.href
      || getRowText(i)
      || '/#';
  }

  const linkText    = getRowText(0);
  const urlLinkPath = getRowHref(1);
  const logoLinkPath= getRowHref(2);
  const openInNewTab= getRowText(3) === 'true';

  // ── ADD CLASS ──
  block.classList.add('campaign-template-header');

  // ── BACK LINK COL ──
  const backLinkCol = document.createElement('div');
  backLinkCol.className =
    'grid__col-size-4 grid__col-position-1 ' +
    'flex flex--row flex--align-items-center column-one';

  if (urlLinkPath && urlLinkPath !== '/#') {
    const backLink = document.createElement('a');
    backLink.href = urlLinkPath;
    backLink.className =
      'campaign-template-header--back ' +
      'flex flex--row ' +
      'flex--justify-content-between ' +
      'flex--align-items-center';

    if (openInNewTab) {
      backLink.target = '_blank';
      backLink.rel = 'noopener noreferrer';
    }

    if (linkText) {
      const arrow = document.createElement('span');
      arrow.className = 'icon icon--arrow-stem';

      const text = document.createElement('span');
      text.className =
        'campaign-template-header--back__text';
      text.textContent = linkText;

      backLink.append(arrow, text);
    }

    backLinkCol.appendChild(backLink);
  }

  // ── LOGO COL ──
  const logoCol = document.createElement('div');
  logoCol.className =
    'grid__col-size-4 grid__col-position-5 ' +
    'flex flex--row flex--align-items-center';

  const logoLink = document.createElement('a');
  logoLink.href = logoLinkPath;
  logoLink.className = 'logo-link';
  logoLink.style.justifyContent = linkText
    ? 'flex-end' : 'center';

  if (openInNewTab) {
    logoLink.target = '_blank';
    logoLink.rel = 'noopener noreferrer';
  }

  // V1 always uses SVG icon logo
  const icon = document.createElement('span');
  icon.className =
    'icon icon--logo--full--mixed icon--extra-large logo';
  logoLink.appendChild(icon);
  logoCol.appendChild(logoLink);

  // ── EMPTY COL 3 (v1 has no CTA) ──
  const emptyCol = document.createElement('div');
  emptyCol.className =
    'grid__col-size-4 grid__col-position-10 ' +
    'flex flex--row flex--justify-content-end ' +
    'flex--align-items-center';

  // ── GRID ──
  const grid = document.createElement('div');
  grid.className = [
    'container container--default',
    'grid grid__gap--none',
    linkText
      ? 'grid__breakpoint--nobreak'
      : 'grid__breakpoint--large'
  ].join(' ');
  grid.append(backLinkCol, logoCol, emptyCol);

  // ── ASSEMBLE ──
  const innerSticky = document.createElement('div');
  innerSticky.className = 'inner-sticky-container';
  innerSticky.appendChild(grid);

  const stickyContainer = document.createElement('div');
  stickyContainer.className = 'sticky-container';
  stickyContainer.appendChild(innerSticky);

  block.innerHTML = '';
  block.appendChild(stickyContainer);

  // ── RESPONSIVE + HEADROOM ──
  handleResponsive(block, backLinkCol, logoCol);
  await initHeadroom(block);
}