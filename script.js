const teams = [];

const fixtures = [];

const form = document.getElementById("registrationForm");
const teamList = document.getElementById("teamList");
const registrationMessage =
  document.getElementById("registrationMessage");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const teamName =
    document.getElementById("teamName").value.trim();

  const playerName =
    document.getElementById("playerName").value.trim();

  const phone =
    document.getElementById("phone").value.trim();

  if (!teamName || !playerName || !phone) {
    registrationMessage.textContent =
      "Please fill in all fields.";
    return;
  }

  teams.push({
    teamName: teamName,
    playerName: playerName,
    phone: phone,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    points: 0
  });

  registrationMessage.textContent =
    "✅ Team registered successfully!";

  form.reset();

  displayTeams();
  displayTable();
});

function displayTeams() {
  if (teams.length === 0) {
    teamList.innerHTML =
      "<p>No teams registered yet.</p>";
    return;
  }

  teamList.innerHTML = "";

  teams.forEach(function (team) {
    const card = document.createElement("div");

    card.className = "team-card";

    card.innerHTML = `
      <h3>⚽ ${team.teamName}</h3>
      <p>${team.playerName}</p>
    `;

    teamList.appendChild(card);
  });
}

function displayTable() {
  const table =
    document.getElementById("leagueTable");

  table.innerHTML = "";

  teams.forEach(function (team, index) {
    table.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${team.teamName}</td>
        <td>${team.played}</td>
        <td>${team.wins}</td>
        <td>${team.draws}</td>
        <td>${team.losses}</td>
        <td>${team.points}</td>
      </tr>
    `;
  });
}

displayTeams();
displayTable();

function showRegister() {
  document.getElementById("register").scrollIntoView({
    behavior: "smooth"
  });
}

function adminLogin() {
  const password = prompt("🔐 Enter Admin Password:");

  if (password === "1234") {
    alert("✅ Admin access granted!");

    document.getElementById("admin").innerHTML = `
      <h2>🔐 Admin Dashboard</h2>

      <p>Welcome, Admin!</p>

      <button onclick="addFixture()">
        📅 Add Fixture
      </button>

      <button onclick="clearTeams()">
        🗑️ Clear Teams
      </button>
    `;
  } else {
    alert("❌ Wrong password!");
  }
}

function addFixture() {
  const home = prompt("Enter Home Team:");
  const away = prompt("Enter Away Team:");
  const time = prompt("Enter Match Time:");

  if (!home || !away || !time) {
    alert("Please enter all fixture details.");
    return;
  }

  fixtures.push({
    home: home,
    away: away,
    time: time
  });

  displayFixtures();

  alert("✅ Fixture added!");
}

function displayFixtures() {
  const fixtureList =
    document.getElementById("fixtureList");

  if (fixtures.length === 0) {
    fixtureList.innerHTML =
      "<p>No fixtures available yet.</p>";
    return;
  }

  fixtureList.innerHTML = "";

  fixtures.forEach(function (fixture) {
    fixtureList.innerHTML += `
      <div class="fixture">
        <span class="time">${fixture.time}</span>
        <span class="teams">
          ${fixture.home} 🆚 ${fixture.away}
        </span>
      </div>
    `;
  });
}

function clearTeams() {
  if (confirm("Are you sure you want to clear all teams?")) {
    teams.length = 0;

    displayTeams();
    displayTable();

    alert("🗑️ All teams have been removed.");
  }
}
