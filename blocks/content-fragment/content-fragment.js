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
      const cfPath = '/assets/api/wysiwygEdge';
      const cfPath2 = '/content/dam/wysiwygEdge';
      const cfPath3 = '/content/dam';
      const query = new URLSearchParams({
        cursor: 'string',
        limit: '1',
        path: cfPath,
        references: 'direct-hydrated',
      }).toString();
      // eslint-disable-next-line
      const query2 = new URLSearchParams({
        cursor: 'string',
        limit: '1',
        path: cfPath2,
        references: 'direct-hydrated',
      }).toString();
      // eslint-disable-next-line
      const query3 = new URLSearchParams({
        cursor: 'string',
        limit: '1',
        path: cfPath3,
        references: 'direct-hydrated',
      }).toString();
      const bucket = 'author-p66217-e731910';
      const token = 'eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LWF0LTEuY2VyIiwia2lkIjoiaW1zX25hMS1rZXktYXQtMSIsIml0dCI6ImF0In0.eyJpZCI6IjE3Mjg0ODg0NDUwNzVfMjA3ZTY1MDktZmRiNi00ZmVlLThlZjMtODU1ZGE4MzBmNmY2X3VlMSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJjbS1wNjYyMTctZTczMTkxMC1pbnRlZ3JhdGlvbi0zIiwidXNlcl9pZCI6IjI1QTMxRTMxNjcwNTY4QUUwQTQ5NUZBMUB0ZWNoYWNjdC5hZG9iZS5jb20iLCJhcyI6Imltcy1uYTEiLCJhYV9pZCI6IjI1QTMxRTMxNjcwNTY4QUUwQTQ5NUZBMUB0ZWNoYWNjdC5hZG9iZS5jb20iLCJjdHAiOjAsImZnIjoiWTNKS1o1SDZGUFA1TUhVS0ZNUVZZSEFBVFE9PT09PT0iLCJtb2kiOiJiMDc3NTUxYiIsImV4cGlyZXNfaW4iOiI4NjQwMDAwMCIsInNjb3BlIjoicmVhZF9wYy5kbWFfYWVtX2FtcyxvcGVuaWQsQWRvYmVJRCxyZWFkX29yZ2FuaXphdGlvbnMsYWRkaXRpb25hbF9pbmZvLnByb2plY3RlZFByb2R1Y3RDb250ZXh0IiwiY3JlYXRlZF9hdCI6IjE3Mjg0ODg0NDUwNzUifQ.FohXYJox4Rhg1Q1-Umcv-M2okU1i3aNoUyD3gNPGNafmeSB26z-oNRWh_hJ-kSLQ3WCF_9k0lpd7XuVkFQFnuPB6PVCg6f9fHFUkiynsO-tWdEWJythjiWM-dxAXAzusm8hCLw3wqt2CmJHbzCAvVIX_ftausuNoqueJUhZBrxrwmWHN5k3w5yn93XMFAXh00qAM9tpSoNLwsAtaXRlknQmNyVXYOBPxBzTqXLbWHYNzusF7yHB2gy2hVOaTNSwBKSM4PUv3h40FsIt_Q_HBQeMFAnMwXywXaEGy2w4yy5f-muA7nxOP0yd_zUajJUht0bxMHffoWz0oPKCCq6TAmw'; // Replace with your actual token
      const totalURL = `https://${bucket}.adobeaemcloud.com/adobe/sites/cf/fragments?${query}`;
      // eslint-disable-next-line
      const totalURL2 = `https://${bucket}.adobeaemcloud.com/adobe/sites/cf/fragments?${query}`;
      // eslint-disable-next-line
      const totalURL3 = `https://${bucket}.adobeaemcloud.com/adobe/sites/cf/fragments?${query3}`;
      const response = await fetch(
        `${totalURL}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // eslint-disable-next-line
      const response2 = await fetch(
        `${totalURL}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (!response.ok && data.ok) {
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
