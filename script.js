let leagueStarted = false;

const teams = [];

const fixtures = [];

const form = document.getElementById("registrationForm");
const teamList = document.getElementById("teamList");
const registrationMessage =
  document.getElementById("registrationMessage");

form.addEventListener("submit", function (e) {
  if (leagueStarted === true) {
  registrationMessage.textContent =
    "🔒 Registration is closed. The league has started.";
  return;
  }
  e.preventDefault();

  const teamName = document.getElementById("teamName").value.trim();
  const playerName = document.getElementById("playerName").value.trim();

  if (teamName === "" || playerName === "") {
    registrationMessage.textContent =
      "⚠️ Please fill in all fields.";
    return;
  }

  teams.push({
    teamName: teamName,
    playerName: playerName,
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

  teams.sort(function (a, b) {
  return b.points - a.points;
});

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
      <div class="season-setup">
  <h3>⚙️ Season Setup</h3>

  <p>Registered Teams: <strong>${teams.length}</strong></p>

  <label>
    Match Format:
  </label>

  <select id="legFormat">
    <option value="1">1 Leg</option>
    <option value="2">2 Legs</option>
  </select>

  <br><br>

  <button onclick="generateFixtures()">
    📅 Generate Fixtures
  </button>
</div>

      <button onclick="addFixture()">
        📅 Add Fixture
      </button>
      <button onclick="addResult()">
  🏆 Enter Match Result
</button>
      <button onclick="startLeague()">
  🏆 Start League
</button>

<button onclick="reopenRegistration()">
  🔓 Reopen Registration
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

  fixtures.forEach(function (fixture, index) {
    const match = document.createElement("div");

    match.className = "fixture";

    match.innerHTML = `
      <span class="time">${fixture.time}</span>
      <span class="teams">
        ${fixture.home} 🆚 ${fixture.away}
      </span>
      <button onclick="enterFixtureResult(${index})">
        🏆 Enter Result
      </button>
    `;

    fixtureList.appendChild(match);
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

function startLeague() {
  if (leagueStarted) {
    alert("⚠️ The league has already started!");
    return;
  }

  if (teams.length === 0) {
    alert("❌ Register at least one team first.");
    return;
  }

  const confirmStart = confirm(
    "🏆 Are you sure you want to start the league?\n\nRegistration will be permanently closed."
  );

  if (!confirmStart) {
    return;
  }

  leagueStarted = true;

  alert(
    "🏆 LEAGUE STARTED!\n\n🔒 Registration is now CLOSED."
  );

  form.querySelectorAll("input, button").forEach(function (element) {
    element.disabled = true;
  });

  registrationMessage.textContent =
    "🔒 Registration CLOSED — The league has started.";
}

function reopenRegistration() {
  if (!leagueStarted) {
    alert("ℹ️ Registration is already open.");
    return;
  }

  const confirmReopen = confirm(
    "🔓 Reopen registration?\n\nNew teams will be allowed to register again."
  );

  if (!confirmReopen) {
    return;
  }

  leagueStarted = false;

  form.querySelectorAll("input, button").forEach(function (element) {
    element.disabled = false;
  });

  registrationMessage.textContent =
    "🟢 Registration is OPEN again.";

  alert("🔓 Registration has been reopened!");
}
function addResult() {
  const home = prompt("Enter Home Team:");
  const away = prompt("Enter Away Team:");

  const homeScore = Number(prompt("Enter Home Score:"));
  const awayScore = Number(prompt("Enter Away Score:"));

  if (
    !home ||
    !away ||
    isNaN(homeScore) ||
    isNaN(awayScore)
  ) {
    alert("⚠️ Please enter all details correctly.");
    return;
  }

  const homeTeam = teams.find(function (team) {
    return team.teamName === home;
  });

  const awayTeam = teams.find(function (team) {
    return team.teamName === away;
  });

  if (!homeTeam || !awayTeam) {
    alert("❌ Team not found.");
    return;
  }

  homeTeam.played++;
  awayTeam.played++;

  if (homeScore > awayScore) {
    homeTeam.wins++;
    homeTeam.points += 3;
    awayTeam.losses++;
  } else if (homeScore < awayScore) {
    awayTeam.wins++;
    awayTeam.points += 3;
    homeTeam.losses++;
  } else {
    homeTeam.draws++;
    awayTeam.draws++;
    homeTeam.points++;
    awayTeam.points++;
  }

  displayTable();

  alert("✅ Result added and table updated!");
  }
function enterFixtureResult(index) {
  const fixture = fixtures[index];

  const homeScore = Number(
    prompt(fixture.home + " score:")
  );

  const awayScore = Number(
    prompt(fixture.away + " score:")
  );

  if (
    isNaN(homeScore) ||
    isNaN(awayScore) ||
    homeScore < 0 ||
    awayScore < 0
  ) {
    alert("⚠️ Please enter valid scores.");
    return;
  }

  const homeTeam = teams.find(function (team) {
    return team.teamName === fixture.home;
  });

  const awayTeam = teams.find(function (team) {
    return team.teamName === fixture.away;
  });

  if (!homeTeam || !awayTeam) {
    alert("❌ One or both teams were not found.");
    return;
  }

  homeTeam.played++;
  awayTeam.played++;

  if (homeScore > awayScore) {
    homeTeam.wins++;
    homeTeam.points += 3;
    awayTeam.losses++;
  } else if (homeScore < awayScore) {
    awayTeam.wins++;
    awayTeam.points += 3;
    homeTeam.losses++;
  } else {
    homeTeam.draws++;
    awayTeam.draws++;
    homeTeam.points++;
    awayTeam.points++;
  }

  fixture.homeScore = homeScore;
  fixture.awayScore = awayScore;
  fixture.completed = true;

  displayFixtures();
  displayTable();

  alert("✅ Match result saved!");
}
