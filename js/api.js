import { getAll } from "./db.js";

let schedule;

let baseurl = "https://api.football-data.org/";

const fetchApi = function(baseurl) {    

  return fetch(baseurl , {
    headers: {
      "X-Auth-Token": "729550ea91894805999f2551839c1914",
    },
  })
    

};

export function getStandings() {
  if ("caches" in window) {
    caches
      .match(baseurl + `v2/competitions/2019/standings`)
      .then(function (response) {
        if (response) {
          response.json().then(function (data) {
            console.log("Competition Data: " + data);
            showStanding(data);
          });
        }
      });
  }

  fetchApi(baseurl + `v2/competitions/2019/standings`).then((response) => response.json())
    .then((data) => {
      showStanding(data);
    });
  
}

function showStanding(data) {
  let standingHTML = "";
  data.standings[0].table.forEach((e) => {
    standingHTML += `
          
            <tr>
              <td class="col s1">${e.position}</td>
              <td class="col s2 "style="text-align: left;">
                <div class='flex'>
                  <img class='logo responsive-img ' src="${e.team.crestUrl.replace(
                    /^http:\/\//i,
                    "https://"
                  )}" alt="logo">
                  <p class="team-name">${e.team.name}</p>
                </div>
              </td>  
              <td class="col s1 offset-s1">${e.playedGames}</td>
              <td class="col s1 ">${e.won}</td>
              <td class="col s1 ">${e.draw}</td>
              <td class="col s1 ">${e.lost}</td>
              <td class="col s1 ">${e.goalsFor}</td>
              <td class="col s1 ">${e.goalsAgainst}</td>
              <td class="col s1 ">${e.goalDifference}</td>
              <td class="col s1 ">${e.points}</td>
            </tr>
            `;
  });
  document.querySelector(".standings").innerHTML = standingHTML;
}

export function getSchedules() {
  if ("caches" in window) {
    caches
      .match(baseurl + `v2/competitions/2019/matches?status=SCHEDULED`)
      .then((response) => {
        if (response) {
          response
            .json()
            .then(function (data) {
              schedule = data;

              return caches.match(baseurl + `v2/competitions/2019/teams`, {
                headers: {
                  "X-Auth-Token": "729550ea91894805999f2551839c1914",
                },
              });
            })
            .then((response) => {
              return response.json();
            })
            .then((responseJson) => {
              showHomeTeam(responseJson, schedule);
              showAwayTeam(responseJson, schedule);
              showMatches(schedule);
            });
        }
      });
  }

  

  fetchApi(baseurl + `v2/competitions/2019/matches?status=SCHEDULED`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // Store the post data to a variable
     
      schedule = data;

      // Fetch another API
      return fetch(baseurl + `v2/competitions/2019/teams`, {
        headers: {
          "X-Auth-Token": "729550ea91894805999f2551839c1914",
        },
      });
    })
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      showHomeTeam(responseJson, schedule);
      showAwayTeam(responseJson, schedule);
      showMatches(schedule);
    });
}

function showAwayTeam(responseJson, schedule) {
  const teams = responseJson.teams;
  const matches = schedule.matches;

  const matchesawayteam = matches.map((e) => {
    return e.awayTeam;
  });

  const mergedAwayTeam = (a1, a2) =>
    a1.map((itm) => ({
      ...a2.find((item) => item.id === itm.id && item),
      ...itm,
    }));

  const awayteam = mergedAwayTeam(matchesawayteam, teams);
  
  let awayHtml = "";
  
  awayteam.map((e) => {
    awayHtml += `
          <ul class="collection">
              <li class="collection-item avatar flex">
              <img src="${e.crestUrl}" alt="" class="logo-matches responsive-img">
                <p class="title ">${e.name}</p>
                
              </li>
            </ul>
      </div>
      `;
  });

  document.querySelector(".away").innerHTML = awayHtml;
}

function showMatches(schedule) {
  const matches = schedule.matches;

  let matchesHtml = "";
 matches.length ? ( matches.map((e) => {
    matchesHtml += `
    <ul class="collection">
    <li class="collection-item avatar match-divider">
    <p class="matchday  ">Matchday ${e.matchday}</p>
  
    <p class="matchday  ">${e.utcDate.slice(0, 10)}</p>
    </li>
    </ul>
    

      
  `})) : (matchesHtml += `No Upcoming Match`)
 
    document.querySelector(".matches").innerHTML = matchesHtml;
  
}
function showHomeTeam(responseJson, schedule) {
  const teams = responseJson.teams;
  const matches = schedule.matches;
  const matcheshometeam = matches.map((e) => {
    return e.homeTeam;
  });

  const mergedHomeTeam = (a1, a2) =>
    a1.map((itm) => ({
      ...a2.find((item) => item.id === itm.id && item),
      ...itm,
    }));

  const hometeam = mergedHomeTeam(matcheshometeam, teams);

  let homeHtml = "";
  
  hometeam.map((e) => {
    homeHtml += `
      <ul class="collection">
          <li class="collection-item avatar flex">
          <img src="${e.crestUrl}" alt="" class="logo-matches responsive-img">
            <p class="title ">${e.name}</p>
            
          </li>
        </ul>
  `;
    document.querySelector(".home").innerHTML = homeHtml;
  });
}

export function getTeams() {
  return new Promise(function (resolve, reject) {
    if ("caches" in window) {
      caches
        .match(baseurl + `v2/competitions/2019/teams`)
        .then(function (response) {
          if (response) {
            response.json().then(function (data) {
              showTeams(data);
              resolve(data.teams);
            });
          }
        });
    }

    fetchApi(baseurl + `v2/competitions/2019/teams`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        showTeams(data);
        resolve(data.teams);
      });
  });
}

function showTeams(data) {
  let teamsHTML = "";
  data.teams.forEach((e) => {
    teamsHTML += `
 
  <div class="clubs">
  <button class="team-menu"  data-id="${e.id}" data-club=${e.shortName}>
    <div class="circle-wrapper">
    <img src="${e.crestUrl.replace(
      /^http:\/\//i,
      "https://"
    )}" alt="" class="team-logo responsive-img">
    
    </div>
    <p class="shortname black-text" >${e.shortName}</p>
    </button>
    </div>`;
  });

  document.querySelector(".teams").innerHTML = teamsHTML;
}

export function getSchedulesById(e) {
  if ("caches" in window) {
    const button = e.target.closest("button");
    const id = button.dataset.id;
    caches
      .match(baseurl + `v2/teams/${id}/matches?status=SCHEDULED`)
      .then((response) => {
        if (response) {
          response
            .json()
            .then(function (data) {
              schedule = data;

              return caches.match(baseurl + `v2/competitions/2019/teams`, {
                headers: {
                  "X-Auth-Token": "729550ea91894805999f2551839c1914",
                },
              });
            })
            .then((response) => {
              return response.json();
            })
            .then((responseJson) => {
              showHomeTeam(responseJson, schedule);
              showAwayTeam(responseJson, schedule);
              showMatches(schedule);
              showAddToFavourites(button)
            });
        }
      });
  }
  const button = e.target.closest("button");
  const id = button.dataset.id;
  let matchesHtml = `<div class="flex-center">
                      <div class="loader"></div>
                    </div>`;
  let saveHtml = ``;
  let homeHtml = ``;
  let awayHtml = ``;
  document.querySelector(".matches").innerHTML = matchesHtml;
  document.querySelector(".home").innerHTML = homeHtml;
  document.querySelector(".away").innerHTML = awayHtml;
  document.querySelector(".favourite").innerHTML = saveHtml;

  fetchApi(baseurl + `v2/teams/${id}/matches?status=SCHEDULED`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // Store the post data to a variable
      schedule = data;

      // Fetch another API
      return fetch(baseurl + `/v2/competitions/2019/teams`, {
        headers: {
          "X-Auth-Token": "729550ea91894805999f2551839c1914",
        },
      });
    })
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      showHomeTeam(responseJson, schedule);
      showAwayTeam(responseJson, schedule);
      showMatches(schedule);
      showAddToFavourites(button)
    });
}

function showAddToFavourites(button){
  let saveHtml = ``;
  const clubName = button.dataset.club;
  const id = button.dataset.id;
      const isFromSaved = window.location.toString().includes("saved");

      if (isFromSaved) {
        saveHtml += `<span class="favourite-btn white-text" data-id=${id}>Remove ${clubName} From Favourites</span>`;

        document.querySelector(".favourite").innerHTML = saveHtml;
      } else {
        saveHtml += `<span class="favourite-btn white-text" data-id=${id}>Add ${clubName} To Favourites</span>`;

        document.querySelector(".favourite").innerHTML = saveHtml;
      }
}

export function getSavedClubs() {
  getAll().then(function (clubs) {
    // Menyusun komponen card artikel secara dinamis

    let teamsHTML = "";

    clubs.forEach((e) => {
      teamsHTML += `
       
        <div class="clubs">
        <button class="team-menu"  data-id="${e.id}" data-club=${e.shortName}>
          <div class="circle-wrapper">
          <img src="${e.crestUrl.replace(
            /^http:\/\//i,
            "https://"
          )}" alt="" class="team-logo responsive-img">
          
          </div>
          <p class="shortname black-text" >${e.shortName}</p>
          </button>
          </div>
       
                `;
    });

    document.getElementById("clubs").innerHTML = teamsHTML;
  });
}

export function getTeamsById(clubId) {
  return new Promise(function (resolve, reject) {
    if ("caches" in window) {
      caches.match(baseurl + `v2/teams/${clubId}`).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            resolve(data);
          });
        }
      });
    }

    fetchApi(baseurl + `v2/teams/${clubId}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        resolve(data);
      });
  });
}
