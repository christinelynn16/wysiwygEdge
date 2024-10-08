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
      // Assuming these values are available in your environment or configuration
      const aemHost = 'https://author-p66217-e731910.adobeaemcloud.com/'; // Replace with your AEM host
      const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkNocmlzdGluZSIsImlhdCI6MTUxNjIzOTAyMn0.GQIptpQBJ8GjoZblnyoriVSwhGMs8XPhK2ScZAmsM0Q'; // Replace with your actual JWT token
      const headers = new Headers({
        Authorization: `Bearer ${jwtToken}`,
        Accept: 'application/json',
      });
      // Using the Content Fragment API (part of the AEM OpenAPI)
      const response = await fetch(`${aemHost}/api/content/fragments/content${path}`, {
        method: 'GET',
        headers,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const resp = await response.json();
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
