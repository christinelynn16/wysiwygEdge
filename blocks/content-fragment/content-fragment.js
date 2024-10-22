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
    // const endpoint = '/content/cq:graphql/wysiwygEdge/endpoint';

    /* const query = `query getEmployeeByName($name: String) {
      employeefragmentList(
        filter: {name: {_expressions: [{value: $name, _operator: CONTAINS, _ignoreCase: true}]}}
      ) {
        items {
          _path
          _variation
          Id
          name
          description
          categoryId
        }
      }
    }`; */

    // const nameStr = 'Stitch';
    const query2 = 'https://author-p66217-e731910.adobeaemcloud.com/graphql/execute.json/wysiwygEdge/getEmployeeByName;name=Stitch';
    try {
      const response2 = await fetch(query2, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LWF0LTEuY2VyIiwia2lkIjoiaW1zX25hMS1rZXktYXQtMSIsIml0dCI6ImF0In0.eyJpZCI6IjE3Mjk2MTgyOTgzODdfZjIwY2FiZjUtNWI5OS00Zjc1LWE3YTgtOTVmYzgyNTQ5YmU2X3VlMSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJjbS1wNjYyMTctZTczMTkxMC1pbnRlZ3JhdGlvbi0zIiwidXNlcl9pZCI6IjI1QTMxRTMxNjcwNTY4QUUwQTQ5NUZBMUB0ZWNoYWNjdC5hZG9iZS5jb20iLCJhcyI6Imltcy1uYTEiLCJhYV9pZCI6IjI1QTMxRTMxNjcwNTY4QUUwQTQ5NUZBMUB0ZWNoYWNjdC5hZG9iZS5jb20iLCJjdHAiOjAsImZnIjoiWTRPRFg1SDZGUFA1TUhVS0ZNUTVZSEFBUzQ9PT09PT0iLCJtb2kiOiI4YWEwYzMwYiIsImV4cGlyZXNfaW4iOiI4NjQwMDAwMCIsInNjb3BlIjoicmVhZF9wYy5kbWFfYWVtX2FtcyxvcGVuaWQsQWRvYmVJRCxyZWFkX29yZ2FuaXphdGlvbnMsYWRkaXRpb25hbF9pbmZvLnByb2plY3RlZFByb2R1Y3RDb250ZXh0IiwiY3JlYXRlZF9hdCI6IjE3Mjk2MTgyOTgzODcifQ.fYDfIOf6MeKIr5T7Fa_NfCnYop5yPZivTCpLVQgqN01bvIcM3UNIo928IzXmTEASQsBC9ijfUNe9t6U72ftVELySrmGWGpTg2hqlx-nxsfdxJGRImETmEtn-NwV_6TAHrl2wA3FzGOuoIzkGK1LrJMkht4oihmftQUCSkc9EtzVdXf8i4Pvg5mhfzyUS66v95PickIxSQh-AYIwOcGQmVbYxqUUwEKsyTsyqhl-RwfRUO-lrdazVEg2a1NZ-77E4eNVxI85iIdUrmIuvz8f_CHlZdYipwK-sc5RLG-MKn1T7sirFZOEkeBPGtiFvmzqf_zh_7Mv4NJDG43vRKNK_4A',
        },
      });
      if (!response2.ok) {
        console.error('Failed to fetch data:', response2.statusText);
        return;
      }

      const result = await response2.json();
      console.log('GraphQL Response:', result);
      if (result.errors) {
        console.error('GraphQL Errors:', result.errors);
        return;
      }
      if (response2.ok) {
        const main = document.createElement('main');
        main.innerHTML = await response2.text();
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
        // return main;
      }
    } catch (error) {
      console.error('Error fetching content fragment:', error);
    }
  }
  // return null;
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
