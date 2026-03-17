import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {


  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';

  const fragment = await loadFragment(footerPath);

  if (!fragment) return;

  const wrapper = fragment.querySelector('.default-content-wrapper')
    || fragment;


  const logoImg = wrapper.querySelector('p > img');
  if (logoImg) {
    logoImg.className = 'footer__logo-img';

  }

  const logoHTML = logoImg
    ? `<a href="/" class="footer__logo-link">${logoImg.outerHTML}</a>`
    : `<a href="/" class="footer__logo-link">
         <svg role="img" class="footer__logo-svg" aria-label="Zimmer Biomet Logo">
           <use xlink:href="#icon-logo--full--mixed"></use>
         </svg>
       </a>`;


  const lists      = [...wrapper.querySelectorAll('ul')];
  const topList     = lists[0];
  const utilityList = lists[1];

  const topLinksHTML = topList
    ? [...topList.querySelectorAll('li')]
        .map(li => {
          const anchor = li.querySelector('a');
          const text   = li.textContent?.trim();
          const href   = anchor?.href || '#';
          const target = anchor?.target || '_self';
          if (!text) return '';
          return `<a class="footer__top-link"
                     href="${href}"
                     target="${target}">${text}</a>`;
        })
        .filter(Boolean)
        .join('')
    : '';


  const utilityLinksHTML = utilityList
    ? [...utilityList.querySelectorAll('li')]
        .map((li, i) => {
          const anchor = li.querySelector('a');
          const text   = li.textContent?.trim();
          const href   = anchor?.href || '#';
          const target = anchor?.target || '_self';
          if (!text) return '';
          const sep = i > 0
            ? '<span class="footer__separator" aria-hidden="true">•</span>'
            : '';
          return `${sep}
                  <a class="footer__utility-link"
                     href="${href}"
                     target="${target}">${text}</a>`;
        })
        .filter(Boolean)
        .join('')
    : '';

  const socials = [
    { href: 'https://www.facebook.com/zimmerbiomet',         icon: 'facebook',  label: 'Facebook'  },
    { href: 'https://www.linkedin.com/company/zimmerbiomet', icon: 'linkedin',  label: 'LinkedIn'  },
    { href: 'https://www.instagram.com/zimmerbiomet_zbh/',   icon: 'instagram', label: 'Instagram' },
    { href: 'https://x.com/zimmerbiomet',                    icon: 'twitter',   label: 'Twitter'   },
  ];

  const socialHTML = socials.map(s => `
    <a class="footer__social-link footer__social-link--${s.icon}"
       href="${s.href}"
       target="_blank"
       rel="noopener noreferrer"
       aria-label="${s.label}">
      <svg role="img" class="footer__social-icon" aria-hidden="true" focusable="false">
        <use xlink:href="#icon-${s.icon}"></use>
      </svg>
    </a>
  `).join('');


  block.innerHTML = `
    <footer >
    <div class="footer_inner">
      <div class="footer__top">
        <div class="footer__logo">${logoHTML}</div>
        <div class="footer__top-links">${topLinksHTML}</div>
        <div class="footer__social">${socialHTML}</div>
      </div>

      <hr class="footer__divider">

      <div class="footer__middle">
        ${utilityLinksHTML}
      </div>
    </div>
    </footer>
  `;

  console.log('Footer loaded',block);
}