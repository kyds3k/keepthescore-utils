import "./style.css";

const token = import.meta.env.VITE_KEEPTHESCORE_TOKEN;
const giphyKey = import.meta.env.VITE_GIPHY_KEY;

const playerEndPoint = `https://keepthescore.com/api/${token}/player/`;
const boardEndPoint = `https://keepthescore.com/api/${token}/board/`;
const scoreEndPoint = `https://keepthescore.com/api/${token}/score/`;
const roundEndPoint = `https://keepthescore.com/api/${token}/board/round/`;

getTeams();

// when button with class "team-add" is clicked, add a new player
document.querySelector(".team-add").addEventListener("click", (e) => {
  e.preventDefault();
  const teamName = document.querySelector("#team-name").value;
  const teamImage = document.querySelector("#team-image").value;
  if (teamName) {
    addTeam(teamName, teamImage);
  } else {
    alert ('Please enter a team name');
  }
});

document.querySelector(".board-get").addEventListener("click", (e) => {
  e.preventDefault();
  getTeams();
});

document.querySelector(".gifs-get").addEventListener("click", (e) => {
  e.preventDefault();
  const gifSearch = document.querySelector("#gif-search").value;
  getGifs(gifSearch);
});


function addTeam(teamName, teamImage) {
  // Define the options for the POST request
  const options = {
    method: "POST",
    body: JSON.stringify({
      "team": null,
      "name": teamName,
      "score": 0,
      "profile_image": teamImage
      
    }),
    headers: {
      "Content-Type": "application/json"
    }
  };

  // Send the POST request
  fetch(playerEndPoint, options)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      //change the innerHTML of .team-add to "Team added!"
      console.log("Player created:", data);
      document.querySelector(".team-add").innerHTML = "Team added!";
      getTeams();
      setTimeout(() => {
      // clear the values of all inputs in the .team-add div
      document.querySelector("#team-name").value = "";
      document.querySelector("#team-image").value = "";
      // replace the src of .team-image-preview with the link
      document.querySelector(".team-image-preview").src = "https://media.tenor.com/30iGQ7phGQ4AAAAC/lazy-egg-lazy.gif";        
      document.querySelector(".team-add").innerHTML = "Add Team";      
      }, 2000);
    })
    .catch(error => {
      console.error("Error:", error);
    });
    setTimeout(() => {
      getTeams();
    }, 4000);
}

function getTeams() {
  // Send the GET request
  fetch(boardEndPoint)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      console.log("Board:", data);
      let teamList = document.querySelector(".team-list");
      teamList.innerHTML = "";
      data.players.forEach((team, index) => {
        const bgClass = index % 2 === 0 ? "bg-slate-400" : "bg-slate-600";
        const firstChild = index == 0;
        teamList.innerHTML += 
        `<li class="team my-4 px-4 pt-1 pb-2 break-inside-avoid ${bgClass} ${firstChild ? "mt-0" : ''}">
          <input type="checkbox" class="mr-2 delete-check" id="${team.id}" data-name="${team.name}" data-team="${team.id}" data-board="${token}">
          <label class="cursor-pointer" for="${team.id}">${team.name} (current score: ${team.score})</label>
          <div class="score-ops block pt-2 flex gap-4 text-white">
            <button class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-5 rounded score-change score-minus" data-team="${team.id}" data-value="1" data-board="${token}">-1</button>
            <button class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-5 rounded score-change score-minus" data-team="${team.id}" data-value="5" data-board="${token}">-5</button>
            <input type="number" class="score text-black w-[75px] py-1 px-2 transition-colors" value="0" data-team="${team.id}" data-board="${token}">            
            <button class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-5 rounded score-change score-plus" data-team="${team.id}" data-value="1" data-board="${token}">+1</button>
            <button class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-5 rounded score-change score-plus" data-team="${team.id}" data-value="5" data-board="${token}">+5</button>            
          </div>
        </li>`;
      });
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

function deleteTeam(teamId, teamName) {
  // Define the options for the DELETE request
  const options = {
    method: "DELETE",
    body: JSON.stringify({
      "token": token,
      "player_id": teamId
    })
  };

  // Send the DELETE request
  fetch(playerEndPoint + teamId, options)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response;
    })
    .then(data => {
      console.log(`${teamName} deleted!`);
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

function addScore(id, score) {
  const sendId = parseInt(id);
  const sendScore = parseFloat(score);
  
  const data = JSON.stringify({
    "player_id": sendId,
    "score": sendScore,
    "goal": 0
  });

  const xhr = new XMLHttpRequest();
  xhr.open("POST", scoreEndPoint, true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 201) {
        console.log("Score added!");
        // Handle success response if needed
      } else {
        console.error("Error:", xhr.statusText);
        // Handle error response if needed
      }
    }
  };

  xhr.send(data);
}

function addScores() {
  // for each .score input, grab the data-team value, and the value of the input, and put them into a JSON object {"scores: [{player_id: 1, score: 0}, {player_id: 2, score: 0}]} and send it to the API"}
  const scoreInputs = document.querySelectorAll(".score");
  let scores = [];
  scoreInputs.forEach((scoreInput) => {
    const teamId = scoreInput.getAttribute("data-team");
    const score = scoreInput.value;
    scores.push({player_id: teamId, score: score});
  });
  const data = JSON.stringify({
    "scores": scores
  });
  const xhr = new XMLHttpRequest();
  xhr.open("POST", roundEndPoint, true);  
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log("Scores added!");
        scoreInputs.forEach((scoreInput) => {
          scoreInput.value = 0;
        });
        // Handle success response if needed
      } else {
        console.error("Error:", xhr.statusText);
        // Handle error response if needed
      }
    }
  };

  xhr.send(data);
}


document.querySelector(".teams-delete").addEventListener("click", (e) => {
  e.preventDefault();
  console.log('Executing Order 66');
  const checkboxes = document.querySelectorAll(".delete-check:checked");

  let index = 0;

  function processCheckboxes() {
    if (index < checkboxes.length) {
      const checkbox = checkboxes[index];
      console.log('Deleting team:', checkbox.getAttribute("data-name"));
      deleteTeam(checkbox.getAttribute("data-team"), checkbox.getAttribute("data-name"));

      index++; // Move to the next checkbox

      setTimeout(processCheckboxes, 5000); // 5000 milliseconds = 5 seconds
    } else {
      console.log('All done!');
      getTeams();
    }
  }

  if (checkboxes.length > 0) {
    processCheckboxes();
  } else {
    alert('Nothing checked!')
  }
});

document.querySelector(".score-update").addEventListener("click", (e) => {
  console.log('DRAMATIC SCORE UPDATE');
  addScores();
});

// Score functionality

// if ".score-change" is clicked, check if it has class "score-plus" or "score-minus". If so, add or subtract the value of its data-value attribute from the value of the input with class "score" that has the same data-team attribute
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("score-change")) {
    const teamId = e.target.getAttribute("data-team");
    const boardId = e.target.getAttribute("data-board");
    const value = e.target.getAttribute("data-value");
    const scoreInput = document.querySelector(`.score[data-team="${teamId}"]`);
    const score = parseInt(scoreInput.value);
    const newScore = e.target.classList.contains("score-plus") ? score + parseInt(value) : score - parseInt(value);
    scoreInput.value = newScore;      
  }
});


//GIF functionality

function getGifs(searchTerm) {
  let xhr = new XMLHttpRequest();
  const url = `//api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=${giphyKey}&limit=10`;
  let data;
  const gifContainer = document.querySelector(".gifs-modal-content-inner");
  // clear all content from gifContainer
  gifContainer.innerHTML = "";

  xhr.open("GET", url, true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      data = JSON.parse(xhr.responseText);
      console.log(typeof data);
      //foreach loop to get each gif
      data.data.forEach((gif) => {
        let item = `<div class="gif-item w-1/4 relative">`
        item += `<img src="https://i.giphy.com/media/${gif.id}/giphy.webp" alt="${gif.title}">`
        item += `<span class="copy-link absolute cursor-pointer bg-gray-400 p-2 rounded top-2 right-2" data-alt="${gif.title}" data-link="https://i.giphy.com/media/${gif.id}/giphy.webp">Choose image</span>`
        item += `</div>`
        gifContainer.innerHTML += item;
      });
      // give ".gifs-modal" active class
      document.querySelector(".gifs-modal").classList.add("active");
    } else {
      console.error("Error:", xhr.statusText);
    }
  };

  xhr.onerror = function () {
    console.error("Request failed");
  };

  xhr.send();
}

// if .gifs-modal-close is clicked, remove active class from .gifs-modal
document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".gifs-modal").classList.remove("active");
});

// if .copy-link is clicked, copy its data-link attribute to the clipboard
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("copy-link")) {
    const link = e.target.getAttribute("data-link");
    const alt = e.target.getAttribute("data-alt");
    document.querySelector("#team-image").value = link;
    // replace the src of .team-image-preview with the link
    document.querySelector(".team-image-preview").src = link;
    document.querySelector(".team-image-preview").alt = alt;
  }
});
