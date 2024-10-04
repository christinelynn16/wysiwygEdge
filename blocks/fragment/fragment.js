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
<<<<<<< HEAD
    
=======
    /* eslint-disable no-unused-vars */
    //const jsonSt = '.json';
    //const baseURL = document.location.origin;
    //console.log(jsonSt);
    //console.log(baseURL);

>>>>>>> parent of 28dac15 (Update fragment.js)
    path = path.replace(/(\.plain)?\.html/, '');

    //const path2 = path.replace('/content/dam', '/api/assets');
    //const newpath = '${baseURL}${path2}${jsonSt}';

    const resp = await fetch(`${path}.plain.html`);
    //const resp2 = await fetch(`${path2}`);
    //const resp3 = await fetch(`${newpath}`);
    /* eslint-enable no-unused-vars */

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
