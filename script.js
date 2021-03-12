const url = 'https://www.scorebat.com/video-api/v1/';
const content = document.querySelector('.content');
const filterBtns = document.querySelectorAll('.btn');
const input = document.querySelector('#search');
const date = document.querySelector('#date');
const err = document.querySelector('.err');

// DATE //\r\n
const myDate = new Date().getFullYear();
date.innerHTML = myDate;

const fetchData = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    // This will hold the results. Remember filter doesn't
    // modify the original array.
    let data_results = [];

    if (response.status === 200) {
      filterBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          // Make sure to uppercase since that is what is in names
          let id = e.target.dataset.id.toUpperCase();
          data_results = data.filter((league) => {
            let res = league.competition;

            // We want to compare the name
            if (res.name.includes(id)) {
              return res;
            }
          });

          // For each click, feed the new results to output
          output = filterResults(data_results);
          content.innerHTML = output;
        });
      });
    }
    // search throught
    if (response) {
      input.addEventListener('keyup', () => {
        let searchWord = input.value;
        let data_results = [];
        data_results = data.filter((club) => {
          let sideA = club.side1.name;
          let sideB = club.side2.name;
          let res = club.competition;
          if (
            sideA.toLowerCase().includes(searchWord) ||
            sideB.toLowerCase().includes(searchWord)
          ) {
            return res;
          }
        });

        if (data_results.length === 0) {
          err.innerHTML = 'oops! match not found 😟';
        } else {
          err.innerHTML = '';
        }

        output = filterResults(data_results);
        content.innerHTML = output;
      });
    }
  } catch (error) {
    console.log(error);
  }
};

fetchData();

// Take results, map them to our cards and return them.
function filterResults(data_results) {
  let output = data_results.map(
    (result) => `<article class="card">
        <div class="info">
        <h1 class="league-name"><i class="fas fa-flag"></i> ${
          result.competition.name
        }</h1>
        <h2>⚽ ${result.title}</h2>
        <div class="details">
        <p><i class="fas fa-calendar-week"></i> ${result.date.substring(
          0,
          10
        )}</p>
        <p><i class="fas fa-user-clock"></i> ${result.date.substring(
          11,
          16
        )} UTC</p>
        </div>
        <div class="video">
        <div class="vid">${result.videos[0].embed}</div>
        </div>
        </div>
        </article>
        `
  );
  output = output.join(' ');
  return output;
}
