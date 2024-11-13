function parseURL(url) {
  // Split the URL by slashes
  const parts = url.split('/');

  // Check if the URL has the necessary structure
  if (parts.length >= 9) {
    // Extract region, group, and clinic based on the URL structure
    const region = parts.length > 10 ? parts[parts.length - 4] : parts[parts.length - 3];
    const group = parts.length > 10 ? parts[parts.length - 3] : null;
    const clinic = parts.length > 10 ? parts[parts.length - 2] : parts[parts.length - 2];

    return { region, group, clinic };
  }
  return null;
}

export async function loadAnimals(region, title, main) {
  const bearerToken = 'eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LWF0LTEuY2VyIiwia2lkIjoiaW1zX25hMS1rZXktYXQtMSIsIml0dCI6ImF0In0.eyJpZCI6IjE3MzE0NzE2OTE3NDVfMzE1ZTRkNzgtNTIyOS00ZmRjLWFiYTYtYjgyOThmOTVmYjUxX3VlMSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJjbS1wNjYyMTctZTczMTkxMC1pbnRlZ3JhdGlvbi0zIiwidXNlcl9pZCI6IjI1QTMxRTMxNjcwNTY4QUUwQTQ5NUZBMUB0ZWNoYWNjdC5hZG9iZS5jb20iLCJhcyI6Imltcy1uYTEiLCJhYV9pZCI6IjI1QTMxRTMxNjcwNTY4QUUwQTQ5NUZBMUB0ZWNoYWNjdC5hZG9iZS5jb20iLCJjdHAiOjAsImZnIjoiWTZLT0w1SDZGUFA1TUhVS0ZNUVZZSEFBVFE9PT09PT0iLCJtb2kiOiI2Y2U2OTZmZSIsImV4cGlyZXNfaW4iOiI4NjQwMDAwMCIsInNjb3BlIjoicmVhZF9wYy5kbWFfYWVtX2FtcyxvcGVuaWQsQWRvYmVJRCxyZWFkX29yZ2FuaXphdGlvbnMsYWRkaXRpb25hbF9pbmZvLnByb2plY3RlZFByb2R1Y3RDb250ZXh0IiwiY3JlYXRlZF9hdCI6IjE3MzE0NzE2OTE3NDUifQ.WX9h8IgVhY7YR8jP9UrJ1XMVAu2lFRJ-WomW7i_JfzHyDQCw9bKAyC-ZrjZ4pZTTrIVfBl8HgwkSrRKMJ10k0AzTRaGl-CTaxxo6RFSmn2USHxNQwPiMU76rcZq87V4ZxnwY0Kr_595zY9Pqgajg0gFqbXcMgSJaUkfEVEdTCwdxIIRfc4dNss2HsuG7T3nRyhHcijANMrn7rzuWuYfZ7yuXiCxCTWz0dnXjNx8Tzvrv8LyAn5zsZQuBqWbL4VctKT6Yn9P7yZbfNSvN0bMrwNE06cp9v8Yg09SySkFJ8rwmHE-Z_bR-lAprnM7qxg0eHGLcRp37XhhD_J6cvwO36A';
  if (title) {
    const query = `https://author-p66217-e731910.adobeaemcloud.com/graphql/execute.json/wysiwygEdge/getPracticeAnimals;region=${region};title=${title}`;
    try {
      const response = await fetch(query, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
      });

      // eslint-disable-next-line
      if (!response.ok) {
        console.error('Failed to fetch data:', response.statusText);
      } else {
        const result = await response.json();
        console.log('GraphQL Response:', result);
        if (result.errors) {
          console.error('GraphQL Errors:', result.errors);
        } else {
          // Extract the employeefragmentList
          const { data: { animalList } } = result;

          // Create the container div
          const container = document.createElement('div');
          container.className = 'practice__animals-treated-container';
          container.innerHTML = 'Animals Treated';

          // Create the unordered list
          const ul = document.createElement('ul');
          ul.className = 'practice__animals-treated';

          // Populate the list with animal items
          animalList.forEach((animal) => {
            const li = document.createElement('li');
            li.className = 'practice__animal label-sm';
            li.textContent = animal;
            ul.appendChild(li);
          });

          // Create the "Show all" link
          const showAllLink = document.createElement('a');
          showAllLink.className = 'tabs__showall';
          showAllLink.setAttribute('role', 'button');
          showAllLink.setAttribute('tabindex', '0');
          showAllLink.textContent = 'Show all';

          // Append the "Show all" link to the list
          ul.appendChild(showAllLink);

          // Append the list to the container
          container.appendChild(ul);

          // Append the container to the block
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

  const pagePath = window.location.pathname;

  const { region, title } = parseURL(pagePath);

  if (title) {
    const main = document.createElement('main');
    // eslint-disable-next-line
    const animalsReturned = await loadAnimals(region, title, main);
    block.appendChild(main);
  }
}
