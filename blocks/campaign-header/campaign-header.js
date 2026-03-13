// blocks/campaign-header/campaign-header.js
// Migrated from AEM React CampaignTemplateHeader component
// Replaces: CampaignTemplateHeader.zb.jsx
//           example.zb.jsx
//           container.zb.js (Headroom logic)

// dynamic import Headroom.js (replaces require('headroom.js'))
async function loadHeadroom() {
  const { default: Headroom } = await import(
    'https://cdnjs.cloudflare.com/ajax/libs/headroom/0.12.0/headroom.esm.min.js'
  );
  return Headroom;
}

// ── HELPERS ──

function createBackLink(linkText, urlLinkPath, openInNewTab, ctaBgColor) {
  if (!urlLinkPath) return null;

  const link = document.createElement('a');
  link.href = urlLinkPath || '/#';
  link.className = [
    'campaign-template-header--back',
    'flex',
    'flex--row',
    'flex--justify-content-between',
    'flex--align-items-center'
  ].join(' ');

  if (openInNewTab) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  if (ctaBgColor) {
    link.style.color = ctaBgColor;
  }

  if (linkText) {
    // arrow icon (replaces <Icon name="arrow-stem" />)
    const arrow = document.createElement('span');
    arrow.className = 'icon icon--arrow-stem';
    if (ctaBgColor) arrow.style.fill = ctaBgColor;

    const text = document.createElement('span');
    text.className = 'campaign-template-header--back__text';
    text.textContent = linkText;

    link.append(arrow, text);
  }

  return link;
}


function createLogoLink(logoLinkPath, openInNewTab,
                         logoImage, logoImageAlt, isV2) {
  const link = document.createElement('a');
  link.href = logoLinkPath || '/#';
  link.className = 'logo-link';

  if (openInNewTab) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  // v2 with custom image OR fallback to SVG icon
  if (isV2 && logoImage) {
    // custom logo image (replaces <Image src=... />)
    const img = document.createElement('img');
    img.src = logoImage;
    img.alt = logoImageAlt || '';
    img.className = 'logo';
    link.appendChild(img);
  } else {
    // default SVG icon logo (replaces <Icon name="logo--full--mixed" />)
    const icon = document.createElement('span');
    icon.className = 'icon icon--logo--full--mixed icon--extra-large logo';
    link.appendChild(icon);
  }

  return link;
}


function createCtaButton(ctaUrl, ctaText, ctaBgColor, modalId) {
  if (!ctaText && !modalId) return null;

  const btn = document.createElement('a');
  btn.href = ctaUrl || '#';
  btn.className = 'cta-button';
  btn.textContent = ctaText;

  if (ctaBgColor) {
    btn.style.backgroundColor = ctaBgColor;
    btn.style.borderColor = ctaBgColor;

    // determine text color based on bg brightness
    // replaces model.ctaTextColorClass logic
    const brightness = getColorBrightness(ctaBgColor);
    btn.classList.add(
      brightness > 128
        ? 'cta-button--dark-text'
        : 'cta-button--light-text'
    );
  }

  if (modalId) {
    btn.dataset.modal = modalId;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // trigger modal open
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.dispatchEvent(new CustomEvent('open-modal'));
      }
    });
  }

  return btn;
}


// helper: get brightness from hex color
// replaces Java model.ctaTextColorClass logic
function getColorBrightness(hexColor) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}


// ── RESPONSIVE HANDLING ──
// replaces Utils.onBreakpoint logic from container.zb.js

function handleResponsive(block, ui, isV2) {
  if (isV2) return; // v2 has no responsive column changes

  const mq = window.matchMedia('(max-width: 768px)');

  function onBreakpointChange(e) {
    if (!ui.backLinkCol || !ui.logoCol) return;

    if (e.matches) {
      // below-medium
      ui.backLinkCol.classList.replace(
        'grid__col-size-4', 'grid__col-size-6'
      );
      ui.logoCol.classList.replace(
        'grid__col-size-4', 'grid__col-size-6'
      );
      ui.logoCol.classList.replace(
        'grid__col-position-5', 'grid__col-position-7'
      );
      ui.logoCol.classList.add('flex--justify-content-end');

      const backText = block.querySelector(
        '.campaign-template-header--back__text'
      );
      if (backText) backText.classList.add('hide');

    } else {
      // medium and above
      ui.backLinkCol.classList.replace(
        'grid__col-size-6', 'grid__col-size-4'
      );
      ui.logoCol.classList.replace(
        'grid__col-size-6', 'grid__col-size-4'
      );
      ui.logoCol.classList.replace(
        'grid__col-position-7', 'grid__col-position-5'
      );
      ui.logoCol.classList.remove('flex--justify-content-end');

      const backText = block.querySelector(
        '.campaign-template-header--back__text'
      );
      if (backText) backText.classList.remove('hide');
    }
  }

  mq.addEventListener('change', onBreakpointChange);
  // run immediately on load
  onBreakpointChange(mq);
}


// ── HEADROOM INIT ──
// replaces Headroom init from container.zb.js

async function initHeadroom(block, isV2) {
  const Headroom = await loadHeadroom();

  const tolerance = isV2
    ? 1000
    : (document.querySelector('.hero-jump-links__sticky')
        ? 200000
        : 1000);

  const headroom = new Headroom(block, { tolerance });
  headroom.init();

  return headroom;
}


// ── MAIN DECORATE FUNCTION ──

export default async function decorate(block) {

  // ── READ FIELDS FROM BLOCK ──
  // Universal Editor writes these as data attributes
  // on the block element from the model fields

  const variant     = block.dataset.variant || 'v1';
  const linkText    = block.dataset.linkText || '';
  const urlLinkPath = block.dataset.urlLinkPath || '';
  const logoLinkPath= block.dataset.logoLinkPath || '';
  const logoImage   = block.dataset.logoImage || '';
  const logoImageAlt= block.dataset.logoImageAlt || '';
  const ctaText     = block.dataset.ctaText || '';
  const ctaUrl      = block.dataset.ctaUrl || '';
  const ctaBgColor  = block.dataset.ctaBgColor || '';
  const openInNewTab= block.dataset.openInNewTab === 'true';
  const modalId     = block.dataset.modalId || '';

  const isV2 = variant === 'v2';

  // ── ADD VARIANT CLASS ──
  // replaces className="campaign-template-header-v2"
  block.classList.add('campaign-template-header');
  if (isV2) {
    block.classList.add('campaign-template-header-v2');
  }

  // ── BUILD DOM ──
  // replaces JSX render in example.zb.jsx

  // sticky container (replaces <Container className="sticky-container">)
  const stickyContainer = document.createElement('div');
  stickyContainer.className = 'sticky-container';

  const innerSticky = document.createElement('div');
  innerSticky.className = 'inner-sticky-container';

  // main grid container
  const grid = document.createElement('div');
  grid.className = [
    'container',
    'container--default',
    'grid',
    'grid__gap--none',
    isV2
      ? 'grid__breakpoint--nobreak'
      : (linkText
          ? 'grid__breakpoint--nobreak'
          : 'grid__breakpoint--large')
  ].join(' ');

  // ── COLUMN 1: BACK LINK ──
  const backLinkCol = document.createElement('div');
  backLinkCol.className = [
    'grid__col-size-4',
    'grid__col-position-1',
    'flex',
    'flex--row',
    'flex--align-items-center',
    'column-one'
  ].join(' ');

  if (urlLinkPath) {
    const backLink = createBackLink(
      linkText, urlLinkPath, openInNewTab,
      isV2 ? ctaBgColor : null
    );
    if (backLink) backLinkCol.appendChild(backLink);
  }

  // ── COLUMN 2: LOGO ──
  const logoCol = document.createElement('div');
  logoCol.className = [
    'flex',
    'flex--row',
    'flex--align-items-center',
    'grid__gap--none',
    isV2 ? 'column-two' : '',
    !isV2 ? 'grid__col-size-4 grid__col-position-5' : ''
  ].filter(Boolean).join(' ');

  const logoLink = createLogoLink(
    logoLinkPath, openInNewTab,
    logoImage, logoImageAlt, isV2
  );

  // justify logo based on linkText presence
  logoLink.style.justifyContent = linkText
    ? 'flex-end'
    : 'center';

  logoCol.appendChild(logoLink);

  // ── COLUMN 3: CTA (v2 only) ──
  const ctaCol = document.createElement('div');
  if (isV2 && (ctaText || modalId)) {
    ctaCol.className = [
      'grid__gap--none',
      'column-three',
      'flex',
      'flex--row',
      'flex--justify-content-end',
      'flex--align-items-center'
    ].join(' ');

    const ctaButton = createCtaButton(
      ctaUrl, ctaText, ctaBgColor, modalId
    );
    if (ctaButton) ctaCol.appendChild(ctaButton);
  }

  // ── ASSEMBLE DOM ──
  grid.append(backLinkCol, logoCol);
  if (isV2 && (ctaText || modalId)) {
    grid.appendChild(ctaCol);
  }

  innerSticky.appendChild(grid);
  stickyContainer.appendChild(innerSticky);

  // clear block and append built DOM
  block.innerHTML = '';
  block.appendChild(stickyContainer);

  // ── UI REFERENCES ──
  // mirrors ui object from container.zb.js
  const ui = {
    el: block,
    backLinkCol,
    logoCol,
    backLink: block.querySelector(
      '.campaign-template-header--back'
    ),
    backText: block.querySelector(
      '.campaign-template-header--back__text'
    ),
    logo: block.querySelector('.logo'),
    ctaButton: block.querySelector('.cta-button'),
  };

  // ── RESPONSIVE HANDLING ──
  // replaces Utils.onBreakpoint from container.zb.js
  handleResponsive(block, ui, isV2);

  // ── HEADROOM INIT ──
  // replaces Headroom init from container.zb.js
  await initHeadroom(block, isV2);
}