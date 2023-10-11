import "./style.css";

const token = "emiktfvokje";
const giphyKey = "v7hsD5TZk1sUMipWpt3GijPTm6CuExMO"

const playerEndPoint = `https://keepthescore.com/api/${token}/player/`;
const boardEndPoint = `https://keepthescore.com/api/${token}/board/`;


// when button with class "player-add" is clicked, add a new player
document.querySelector(".player-add").addEventListener("click", (e) => {
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
  getplayers();
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
      console.log("player created:", data);
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

function getplayers() {
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
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

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
        item += `<span class="copy-link absolute cursor-pointer bg-gray-400 p-2 rounded top-2 right-2" data-link="https://i.giphy.com/media/${gif.id}/giphy.webp">Copy Link</span>`
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
    document.querySelector("#team-image").value = link;
    // replace the src of .team-image-preview with the link
    document.querySelector(".team-image-preview").src = link;
  }
});
