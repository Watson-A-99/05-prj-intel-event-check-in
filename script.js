//Get all needed elements from the DOM
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const progressContainer = document.querySelector(".progress-container");
const goalProgressCard = document.getElementById("goalProgressCard");
const goalCelebration = document.getElementById("goalCelebration");
const rosterLists = {
  water: document.getElementById("waterList"),
  zero: document.getElementById("zeroList"),
  power: document.getElementById("powerList"),
};

//Track attendance
let count = 0;
const maxCount = 50; // Set a maximum count for attendees
let lockedWinnerMessage = "";
let lockedWinnerLabel = "Winner";
let lockedWinnerMarkup = "";

function getWinningTeamResult() {
  const waterCount = parseInt(
    document.getElementById("waterCount").textContent,
  );
  const zeroCount = parseInt(document.getElementById("zeroCount").textContent);
  const powerCount = parseInt(
    document.getElementById("powerCount").textContent,
  );

  const teams = [
    { name: "🌊 Team Water Wise", total: waterCount },
    { name: "🌿 Team Net Zero", total: zeroCount },
    { name: "⚡ Team Renewables", total: powerCount },
  ];

  let highestTotal = teams[0].total;
  let winners = [teams[0].name];

  for (let i = 1; i < teams.length; i++) {
    if (teams[i].total > highestTotal) {
      highestTotal = teams[i].total;
      winners = [teams[i].name];
    } else if (teams[i].total === highestTotal) {
      winners.push(teams[i].name);
    }
  }

  if (winners.length === 1) {
    return {
      teamText: winners[0],
      isTie: false,
      winners: winners,
    };
  }

  return {
    teamText: winners.join(" & "),
    isTie: true,
    winners: winners,
  };
}

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form from submitting normally

  // Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

  //Increment count
  count++;
  console.log("Total check-ins:", count);

  //Update progress bar
  const displayCount = Math.min(count, maxCount);
  const percentage = Math.round((displayCount / maxCount) * 100) + "%";
  console.log(`Progress: ${percentage}`);
  attendeeCount.textContent = count;
  progressBar.style.width = percentage;

  //Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  // Add name to roster
  const li = document.createElement("li");
  li.textContent = name;
  rosterLists[team].appendChild(li);

  if (count >= maxCount && lockedWinnerMessage === "") {
    const winningResult = getWinningTeamResult();
    lockedWinnerMessage = winningResult.teamText;
    if (winningResult.isTie) {
      lockedWinnerLabel = "Winners";
      lockedWinnerMarkup =
        '<span class="tie-line">' +
        winningResult.winners[0] +
        "</span>" +
        '<span class="tie-amp">&</span>' +
        '<span class="tie-line">' +
        winningResult.winners[1] +
        "</span>";
    } else {
      lockedWinnerLabel = "Winner";
      lockedWinnerMarkup = lockedWinnerMessage;
    }
    goalCelebration.innerHTML = `
      <span class="celebration-label">🏆 Attendance Goal Reached!<strong> ${lockedWinnerLabel}:</strong></span>
      <span class="celebration-team">${lockedWinnerMarkup}</span>
    `;
    goalCelebration.style.display = "block";
    goalProgressCard.classList.add("goal-reached");
  } else if (lockedWinnerMessage !== "") {
    goalCelebration.innerHTML = `
      <span class="celebration-label">🏆 Attendance Goal Reached! <strong>${lockedWinnerLabel}:</strong></span>
      <span class="celebration-team">${lockedWinnerMarkup}</span>
    `;
  }

  //Show welcome message
  greeting.textContent = `🎉 Welcome, ${name} from ${teamName}!`;
  greeting.className = "success-message";
  greeting.style.display = "block";

  //Reset form
  form.reset();
});
