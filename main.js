import "./style.css";

const token = "emiktfvokje";
const giphyKey = "v7hsD5TZk1sUMipWpt3GijPTm6CuExMO"

const playerEndPoint = `https://keepthescore.com/api/${token}/player/`;
const boardEndPoint = `https://keepthescore.com/api/${token}/board/`;


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
      data.players.forEach((team) => {
        teamList.innerHTML += `<li class="team mb-1"><input type="checkbox" class="mr-2 delete-check" id="${team.id}" data-name="${team.name}" data-team="${team.id}" data-board="${token}"><label class="cursor-pointer" for="${team.id}">${team.name}</label></li>`;
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


function getGifs(searchTerm) {
  let xhr = new XMLHttpRequest();
  const url = `http://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=${giphyKey}&limit=10`;
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
        item += `<span class="copy-link absolute cursor-pointer bg-gray-400 p-2 rounded top-2 right-2" data-alt="${gif.title}" data-link="https://i.giphy.com/media/${gif.id}/giphy.webp">Copy Link</span>`
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
