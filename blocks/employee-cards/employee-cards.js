// const { context, getToken } = require('@adobe/aio-lib-ims');

export async function loadEmployees(clinicId, main) {
  const bearerToken = 'eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LWF0LTEuY2VyIiwia2lkIjoiaW1zX25hMS1rZXktYXQtMSIsIml0dCI6ImF0In0.eyJpZCI6IjE3Mjk3ODEyOTc2OTlfY2UwZjZjMjktOGQzMS00MDMyLTk2MGQtNTA0ODVmYzFlYzk2X3VlMSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJjbS1wNjYyMTctZTczMTkxMC1pbnRlZ3JhdGlvbi0zIiwidXNlcl9pZCI6IjI1QTMxRTMxNjcwNTY4QUUwQTQ5NUZBMUB0ZWNoYWNjdC5hZG9iZS5jb20iLCJhcyI6Imltcy1uYTEiLCJhYV9pZCI6IjI1QTMxRTMxNjcwNTY4QUUwQTQ5NUZBMUB0ZWNoYWNjdC5hZG9iZS5jb20iLCJjdHAiOjAsImZnIjoiWTRUTlI1SDZGUFA1TUhVS0ZNUVZZSEFBVFE9PT09PT0iLCJtb2kiOiI3ZTJjNTEzOCIsImV4cGlyZXNfaW4iOiI4NjQwMDAwMCIsImNyZWF0ZWRfYXQiOiIxNzI5NzgxMjk3Njk5Iiwic2NvcGUiOiJyZWFkX3BjLmRtYV9hZW1fYW1zLG9wZW5pZCxBZG9iZUlELHJlYWRfb3JnYW5pemF0aW9ucyxhZGRpdGlvbmFsX2luZm8ucHJvamVjdGVkUHJvZHVjdENvbnRleHQifQ.Zpa1v_uauBpB_eu3jXgxeJMc4Sok8mToeXC9GfRaUH3keiXrSVR8f4ne8Pidb7ZqUZxJzHGRHT9yZB3gqMuKxKuaXIrv9taFA7WG20MSaRIYtZfrNG14lQ8z4v4m_OrWAQx1vPLzZ2evW-ve2mbOg5DTf1GeDCi5t1OSdBYBcowx_l9BOwBKg5llpFxFSCdHgnBg5B-BZLS5ZQEA0P36mMxmu85WzZwOe4Ibzemhh73wggmb1cTKwmWu-xq83LN5QyZ4BelkCH-w6osJM1eFwOeqY60CJwz2tn2hTrTrg7_sf_Ln_1kC9e8Rle5je62eJYWOJJ210BPx60u6dVa4Fw';

  if (clinicId) {
    const query2 = `https://author-p66217-e731910.adobeaemcloud.com/graphql/execute.json/wysiwygEdge/getEmployeesById;practiceId=${clinicId}`;
    try {
      const response2 = await fetch(query2, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      if (!response2.ok) {
        console.error('Failed to fetch data:', response2.statusText);
      } else {
        const result = await response2.json();
        console.log('GraphQL Response:', result);
        if (result.errors) {
          console.error('GraphQL Errors:', result.errors);
        } else {
          // Extract the employeefragmentList
          const { data: { employeefragmentList } } = result;
          // Change _path to path in all items using forEach
          employeefragmentList.items.forEach((item) => {
            // eslint-disable-next-line
            item.path = item._path; // Create a new key 'path' with the value of '_path'
            // eslint-disable-next-line
            delete item._path; // Delete the old '_path' key
          });
          const container = document.createElement('div');
          container.className = 'edge-card-block'; // Add a class for styling
          employeefragmentList.items.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'edge-card'; // Add a class for individual cards
            const title = document.createElement('h3');
            title.textContent = item.name;
            card.appendChild(title);

            const description = document.createElement('p');
            description.textContent = item.description;
            card.appendChild(description);

            const category = document.createElement('p');
            category.textContent = `Category: ${item.category}`;
            card.appendChild(category);

            const path = document.createElement('p');
            path.textContent = `Path: ${item.path}`;
            card.appendChild(path);

            // Optionally, you can add the Id for reference
            const id = document.createElement('p');
            id.textContent = `ID: ${item.Id}`;
            card.appendChild(id);

            container.appendChild(card);
          });
          main.appendChild(container);
        }
      }
    } catch (error) {
      console.error('Error fetching content fragment:', error);
    }
  }
}

export default async function decorate(block) {
  // eslint-disable-next-line
  // const [clinicId] = block.children;
  const clinicIdElement = block.querySelector('p[data-aue-prop="clinicId"]');
  // Extract the text content
  const clinicId = clinicIdElement ? clinicIdElement.textContent : null;

  if (clinicId) {
    const main = document.createElement('main');
    // eslint-disable-next-line
    const employeesReturned = await loadEmployees(clinicId, main);
    block.appendChild(main);
  }
}
