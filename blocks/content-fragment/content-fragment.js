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
        path: '/content/dam/wysiwygEdge',
        references: 'direct-hydrated',
      }).toString();

      const bucket = 'author-p66217-e731910';
      const resp = await fetch(
        `https://${bucket}.adobeaemcloud.com/adobe/sites/cf/fragments?${query}`,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LWF0LTEuY2VyIiwia2lkIjoiaW1zX25hMS1rZXktYXQtMSIsIml0dCI6ImF0In0.eyJpZCI6IjE3Mjg2NzE4NzYyOTBfYWJkODNiMzQtNzdjOS00ODcyLTg1YmItOGI3Y2ZhY2E2MzBlX3VlMSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJjbS1wNjYyMTctZTczMTkxMC1pbnRlZ3JhdGlvbi0zIiwidXNlcl9pZCI6IjI1QTMxRTMxNjcwNTY4QUUwQTQ5NUZBMUB0ZWNoYWNjdC5hZG9iZS5jb20iLCJhcyI6Imltcy1uYTEiLCJhYV9pZCI6IjI1QTMxRTMxNjcwNTY4QUUwQTQ5NUZBMUB0ZWNoYWNjdC5hZG9iZS5jb20iLCJjdHAiOjAsImZnIjoiWTNQSjM1SDZGUFA1TUhVS0ZNUVZZSEFBVFE9PT09PT0iLCJtb2kiOiIyYThjN2MzNyIsImV4cGlyZXNfaW4iOiI4NjQwMDAwMCIsImNyZWF0ZWRfYXQiOiIxNzI4NjcxODc2MjkwIiwic2NvcGUiOiJyZWFkX3BjLmRtYV9hZW1fYW1zLG9wZW5pZCxBZG9iZUlELHJlYWRfb3JnYW5pemF0aW9ucyxhZGRpdGlvbmFsX2luZm8ucHJvamVjdGVkUHJvZHVjdENvbnRleHQifQ.P3uehb2VsbATgDr4-Fb6QQD4lL3g5C8o6IhQFHindcKGngzx9CCEcJbgCcK_QNeaOjWYR9F2-jJg25R9Y_s9--FQTKvhT-lxVA66PWr2mor1qDlRDIPUfaTXimFfpDejIB_jHqhnC4kqZSaugKVJcLLXYhBa6oFiY0jn6n0-1Czh4QWSTAFxXVTeGiyU501izRa4pp5hIEzo_VE6HSBQ9ZHwretnU81ohMhIFXPoHxwDknN0yaEjOwQrvHkXAJFyKuz9SqACeHISBixuENkXr8CyDtEI9joB3SSEUtVZhgy2-mrmKdvXnXBVOlE3INIOmEggQAbmm4dqmf6bpz-zAw',
          },
        },
      );

      const data = await resp.text();
      console.log(data);
      if (!data.ok) {
        throw new Error(`HTTP error! status: ${data.status}`);
      }
      // eslint-disable-next-line
      const resp2 = await data.json();
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
