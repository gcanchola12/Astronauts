const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

// Handle all fetch requests

async function getJson(url) {
  try {
    const response = await fetch(url);
    return await response.json();

  } catch (error) {
    throw error;

  }
}

async function getPeopleInSpace(url) {
  const peopleJSON = await getJson(url);

  const profiles = peopleJSON.people.map( async (person) => {
    if (person.name == "Andrew Morgan") {
      person.name = "Andrew_R._Morgan";
    }

    const craft = person.craft;
    const profileJSON = await getJson(wikiUrl + person.name);

    return {...profileJSON, craft};
  });
  return Promise.all(profiles);
}


// Generate the markup for each profile
function generateHTML(data) {
  data.map( person => {
    const section = document.createElement('section');
    peopleList.appendChild(section);

    if (typeof (person.thumbnail) != 'undefined') {
      
      section.innerHTML = `<img src=${person.thumbnail.source}>`;
    }

    section.innerHTML += `
      <span>${person.craft}</span>
      <h2>${person.title}</h2>
      <p>${person.description}</p>
      <p>${person.extract}</p>
    `;
  });
}

btn.addEventListener('click', (event) => {
  event.target.textContent = "Loading...";

  getPeopleInSpace(astrosUrl)
  .then(generateHTML)
  .catch( e => {
    peopleList.innerHTML = `<h3>Something went wrong!</h3>`;
    console.error(e);
  })
  .finally( () => event.target.remove() )
});