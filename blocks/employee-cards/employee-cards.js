export async function loadEmployees(clinicId, main) {
  if (clinicId) {
    const query2 = `https://author-p66217-e731910.adobeaemcloud.com/graphql/execute.json/wysiwygEdge/getEmployeesById;practiceId=${clinicId}`;
    try {
      const response2 = await fetch(query2, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LWF0LTEuY2VyIiwia2lkIjoiaW1zX25hMS1rZXktYXQtMSIsIml0dCI6ImF0In0.eyJpZCI6IjE3Mjk2MTgyOTgzODdfZjIwY2FiZjUtNWI5OS00Zjc1LWE3YTgtOTVmYzgyNTQ5YmU2X3VlMSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJjbS1wNjYyMTctZTczMTkxMC1pbnRlZ3JhdGlvbi0zIiwidXNlcl9pZCI6IjI1QTMxRTMxNjcwNTY4QUUwQTQ5NUZBMUB0ZWNoYWNjdC5hZG9iZS5jb20iLCJhcyI6Imltcy1uYTEiLCJhYV9pZCI6IjI1QTMxRTMxNjcwNTY4QUUwQTQ5NUZBMUB0ZWNoYWNjdC5hZG9iZS5jb20iLCJjdHAiOjAsImZnIjoiWTRPRFg1SDZGUFA1TUhVS0ZNUTVZSEFBUzQ9PT09PT0iLCJtb2kiOiI4YWEwYzMwYiIsImV4cGlyZXNfaW4iOiI4NjQwMDAwMCIsInNjb3BlIjoicmVhZF9wYy5kbWFfYWVtX2FtcyxvcGVuaWQsQWRvYmVJRCxyZWFkX29yZ2FuaXphdGlvbnMsYWRkaXRpb25hbF9pbmZvLnByb2plY3RlZFByb2R1Y3RDb250ZXh0IiwiY3JlYXRlZF9hdCI6IjE3Mjk2MTgyOTgzODcifQ.fYDfIOf6MeKIr5T7Fa_NfCnYop5yPZivTCpLVQgqN01bvIcM3UNIo928IzXmTEASQsBC9ijfUNe9t6U72ftVELySrmGWGpTg2hqlx-nxsfdxJGRImETmEtn-NwV_6TAHrl2wA3FzGOuoIzkGK1LrJMkht4oihmftQUCSkc9EtzVdXf8i4Pvg5mhfzyUS66v95PickIxSQh-AYIwOcGQmVbYxqUUwEKsyTsyqhl-RwfRUO-lrdazVEg2a1NZ-77E4eNVxI85iIdUrmIuvz8f_CHlZdYipwK-sc5RLG-MKn1T7sirFZOEkeBPGtiFvmzqf_zh_7Mv4NJDG43vRKNK_4A',
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
          // Change _path to path in all items
          const newEmployeefragmentList = employeefragmentList.map((obj) => {
            // Create a shallow copy
            const newObj = { ...obj };
            // eslint-disable-next-line
            if (newObj._path) {
              // eslint-disable-next-line
              newObj.path = newObj._path;
              // eslint-disable-next-line
              delete newObj._path;
            }
            return newObj;
          });
          const container = document.createElement('div');
          container.className = 'edge-card-block'; // Add a class for styling
          newEmployeefragmentList.items.forEach((item) => {
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
  }
}
