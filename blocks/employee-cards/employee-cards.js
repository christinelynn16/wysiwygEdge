export async function loadEmployees(clinicId, main) {
  const bearerToken = 'eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LWF0LTEuY2VyIiwia2lkIjoiaW1zX25hMS1rZXktYXQtMSIsIml0dCI6ImF0In0.eyJpZCI6IjE3Mjk4NzcwODg4MTZfZDdiNjYzZGUtNDNlNy00MThkLWFmNTYtMWZkYTk5YTc2M2JmX3VlMSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJjbS1wNjYyMTctZTczMTkxMC1pbnRlZ3JhdGlvbi0zIiwidXNlcl9pZCI6IjI1QTMxRTMxNjcwNTY4QUUwQTQ5NUZBMUB0ZWNoYWNjdC5hZG9iZS5jb20iLCJhcyI6Imltcy1uYTEiLCJhYV9pZCI6IjI1QTMxRTMxNjcwNTY4QUUwQTQ5NUZBMUB0ZWNoYWNjdC5hZG9iZS5jb20iLCJjdHAiOjAsImZnIjoiWTRXUko1SDZGUFA1TUhVS0ZNUVZZSEFBVFE9PT09PT0iLCJtb2kiOiI1M2MzMzlhNCIsImV4cGlyZXNfaW4iOiI4NjQwMDAwMCIsInNjb3BlIjoicmVhZF9wYy5kbWFfYWVtX2FtcyxvcGVuaWQsQWRvYmVJRCxyZWFkX29yZ2FuaXphdGlvbnMsYWRkaXRpb25hbF9pbmZvLnByb2plY3RlZFByb2R1Y3RDb250ZXh0IiwiY3JlYXRlZF9hdCI6IjE3Mjk4NzcwODg4MTYifQ.CzuslIN3NuRPXwQKXZ5ci5tiYIWrTEekUC-a_gelJ-C_UNdFtqlwNr0KQd7_cgFkBCwze56lgAZW3PKR1zPtey4qgd9vxy5Tjh-OxtJgcVh465FtA3l785bEoXPYR1G6rgAkTpUoysx1WgvyNjisCZRRDOcpwHieTwNCbLnHNhEn-y_T9-lV-kWRFd-hL8uiEJPU6dp_D_XiqIItaBWtbPCbuUKOsxIBNXy4_lUtYIyDGUzsu5_vucUnTXtfioiU8SE449T-EMG625XK5zZPc6CO_ab8Bcs6TJaYAQ9hhDIARxWT7UX-3hExiJ3px-P0Ou8DBee1EW-Ul9Kt7LgwPg';

  if (clinicId) {
    const query2 = 'https://author-p66217-e731910.adobeaemcloud.com/graphql/execute.json/wysiwygEdge/getEmployeesById';
    const variables = { clinicId };
    try {
      const response2 = await fetch(query2, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({
          variables,
        }),
      });
      // eslint-disable-next-line
      const dummy = 0;
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
