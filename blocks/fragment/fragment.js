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
    /* eslint-disable no-unused-vars */
    // eslint-disable-next-line no-param-reassign
    path = path.replace(/(\.plain)?\.html/, '');
    const path2a = path.replace('/content/dam', '/api/assets');
    const path2 = path2a.concat('.json');
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const windowLocation = window.location.origin;
    const response = await fetch(path2, {
      headers: myHeaders,
      baseURL: windowLocation,
    });
    const fullURL2 = `${windowLocation}${path2}`;
    const resp = await fetch(`${path}.plain.html`);
    const resp2 = await fetch(fullURL2);
    const resp3 = await fetch('https://author-p66217-e731910.adobeaemcloud.com/api/assets/wysiwygEdge/alex.json')
    fetch('https://author-p66217-e731910.adobeaemcloud.com/api/assets/wysiwygEdge/alex.json')
      .then(response => {
        if (response.redirected) {
          console.log('Request was redirected to:', response.url);
        }
        const resp4 = response;
      });
    const query = 'query { employeefragmentList {items { employeeName, employeeTitle, employeeImage{ ... on ImageRef{ _path}}}}}';
    // Define the AEM GraphQL endpoint
    const endpoint = 'https://author-p66217-e731910.adobeaemcloud.com/content/cq:graphql/wysiwygEdge/endpoint';
    // Use fetch to send the GraphQL query
    const qlResp = fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }), // Send the query as a JSON string
    });
    /* eslint-enable no-unused-vars */
    if (resp.ok && resp2.ok) {
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
