import "./style.css";

const token = "emiktfvokje";

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