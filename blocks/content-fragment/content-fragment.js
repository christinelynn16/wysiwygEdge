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
    const endpoint = '/content/cq:graphql/wysiwygEdge/endpoint';

    const query = `query getEmployeeByName($name: String) {
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
    }`;

    const nameStr = 'Stitch';

    const variables = {
      path: nameStr, // Pass the article path as a parameter
    };
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LWF0LTEuY2VyIiwia2lkIjoiaW1zX25hMS1rZXktYXQtMSIsIml0dCI6ImF0In0.eyJpZCI6IjE3Mjk1MzgxODE5NDJfMDM4N2M5MjgtMTgxNy00YTAzLTg5MTgtNDIwNzdkZjZmZDEzX3VlMSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJjbS1wNjYyMTctZTczMTkxMC1pbnRlZ3JhdGlvbi0zIiwidXNlcl9pZCI6IjI1QTMxRTMxNjcwNTY4QUUwQTQ5NUZBMUB0ZWNoYWNjdC5hZG9iZS5jb20iLCJhcyI6Imltcy1uYTEiLCJhYV9pZCI6IjI1QTMxRTMxNjcwNTY4QUUwQTQ5NUZBMUB0ZWNoYWNjdC5hZG9iZS5jb20iLCJjdHAiOjAsImZnIjoiWTRMUUo1SDZGUFA1TUhVS0ZNUTVZSEFBUzQ9PT09PT0iLCJtb2kiOiJmY2Q3OWUzMCIsImV4cGlyZXNfaW4iOiI4NjQwMDAwMCIsInNjb3BlIjoicmVhZF9wYy5kbWFfYWVtX2FtcyxvcGVuaWQsQWRvYmVJRCxyZWFkX29yZ2FuaXphdGlvbnMsYWRkaXRpb25hbF9pbmZvLnByb2plY3RlZFByb2R1Y3RDb250ZXh0IiwiY3JlYXRlZF9hdCI6IjE3Mjk1MzgxODE5NDIifQ.VdRExi3pM00FgRjQ20WLXgR-ulFHBogsASu9IsUgPExapIARzaxb-08VjFTpbxJ5qd--dYX2qxB9rP6jFMvJsm9xWcSwaINl4EhJM1zHOQUT0ce7SQxrUEv_visUHProvfrUYT9gcZLLTCPj9F4ga-H74Zn-xpxsEwOphjCN_g7jEEJhizvv9BBbC3cyPLDxhlAi4D9z5PesjDZTz9loMwGZirddbzpuGtosRe_0pg0btxGmnBcRmPxbkkJk7YmGizvh_QK5cbbnjtjwdJQtgt-gYntMmMgKeZRgYum5LFiQqAf4_UQoVgUim_j500Ggb2nrtx4fk8RdqYa1VbO-dw',
        },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        console.error('Failed to fetch data:', response.statusText);
        return;
      }

      const result = await response.json();
      console.log('GraphQL Response:', result);
      if (result.errors) {
        console.error('GraphQL Errors:', result.errors);
        return;
      }
      if (response.ok) {
        const main = document.createElement('main');
        main.innerHTML = await response.text();
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
