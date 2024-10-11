/*
 * Fragment Block
 * Include content on a page as a fragment.
 * https://www.aem.live/developer/block-collection/fragment
 */

import {
  decorateMain,
} from '../../scripts/scripts.js';

import {
  loadBlocks,
} from '../../scripts/aem.js';

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {HTMLElement} The root element of the fragment
 */
export async function loadFragment(path) {
  if (path && path.startsWith('/')) {
    // eslint-disable-next-line no-param-reassign
    try {
      const query = new URLSearchParams({
        cursor: 'string',
        limit: '1',
        path: '/content/dam/wysiwygEdge',
        references: 'direct-hydrated'
      }).toString();

      const bucket = 'author-p66217-e731910';
      const resp = await fetch(
        `https://${bucket}.adobeaemcloud.com/adobe/sites/cf/fragments?${query}`,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer <YOUR_JWT_HERE>'
          }
        }
      );

      const data = await resp.text();
      console.log(data);
      if (!data.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const resp2 = await response.json();
      if (resp.ok) {
        const main = document.createElement('main');
        main.innerHTML = await resp.text();
        // reset base path for media to fragment base
        const resetAttributeBase = (tag, attr) => {
          main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((elem) => {
            elem[attr] = new URL(elem.getAttribute(attr), new URL(path, window.location)).href;
          });
        };
        resetAttributeBase('img', 'src');
        resetAttributeBase('source', 'srcset');
        decorateMain(main);
        await loadBlocks(main);
        return main;
      }
    } catch (error) {
      console.error('Error fetching content fragment:', error);
    }
  }
  return null;
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();
  const fragment = await loadFragment(path);
  if (fragment) {
    const fragmentSection = fragment.querySelector(':scope .section');
    if (fragmentSection) {
      block.classList.add(...fragmentSection.classList);
      block.classList.remove('section');
      block.replaceChildren(...fragmentSection.childNodes);
    }
  }
}
