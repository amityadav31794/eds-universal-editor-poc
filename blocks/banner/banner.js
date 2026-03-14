export default function decorate(block) {
  // Extract rows (UE always creates rows)
  const [imageRow, titleRow, textRow] = block.children;

  // Get useful elements
  const picture = imageRow?.querySelector('picture');
  const heading = titleRow?.querySelector('h2, h1, h3');
  const paragraph = textRow?.querySelector('p');

  // Add EDS classes
  block.classList.add('banner--eds');

  // Convert image into background image
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      block.style.backgroundImage = `url('${img.src}')`;
      block.classList.add('has-bg');
    }
    // Remove picture from DOM (optional)
    picture.remove();
  }

  // Wrap text inside a container
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'banner-content';

  if (heading) {
    heading.classList.add('banner-heading');
    contentWrapper.append(heading);
  }

  if (paragraph) {
    paragraph.classList.add('banner-text');
    contentWrapper.append(paragraph);
  }

  // Clear block before inserting final structure
  block.innerHTML = '';
  block.append(contentWrapper);
}
