let leagueStarted = false;
let seasonStartDate = null;

const teams = [];

const fixtures = [];

const form = document.getElementById("registrationForm");
const teamList = document.getElementById("teamList");
const registrationMessage =
  document.getElementById("registrationMessage");

async function saveTeamsToCloud() {
  const db = window.db;

  if (!db) {
    console.error("Firebase database not connected.");
    return;
  }

  try {
    const { doc, setDoc } =
      await import("https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js");

    await setDoc(
      doc(db, "competition", "main"),
      {
        teams: teams
      }
    );

    alert("✅ Firebase save completed!");
  } catch (error) {
    console.error("❌ Cloud save failed:", error);
  }
}

async function loadTeamsFromCloud() {
  const db = window.db;

  if (!db) {
    console.error("Firebase database not connected.");
    return;
  }

  try {
    const { doc, getDoc } =
      await import("https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js");

    const snapshot = await getDoc(
      doc(db, "competition", "main")
    );

    if (snapshot.exists()) {
      const data = snapshot.data();

      teams.length = 0;

      teams.push(...(data.teams || []));

      displayTeams();
      displayTable();

      console.log("✅ Teams loaded from cloud.");
    }
  } catch (error) {
    console.error("❌ Cloud load failed:", error);
  }
}

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

  const cleanTeamName = teamName
  .toLowerCase()
  .replace(/\s+/g, " ")
  .trim();

const teamExists = teams.some(function (team) {
  const existingName = team.teamName
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  return existingName === cleanTeamName;
});

if (teamExists) {
  registrationMessage.textContent =
    "⚠️ This team name is already registered. Please choose another name.";
  return;
}

  teams.push({
    teamName: teamName,
    playerName: playerName,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0
  });

  registrationMessage.textContent =
    "✅ Team registered successfully!";

  form.reset();

  displayTeams();
  displayTable();
  saveTeamsToCloud();
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

  const sortedTeams = [...teams].sort(function (a, b) {
    const aGD =
      (a.goalsFor || 0) - (a.goalsAgainst || 0);

    const bGD =
      (b.goalsFor || 0) - (b.goalsAgainst || 0);

    if (b.points !== a.points) {
      return b.points - a.points;
    }

    if (bGD !== aGD) {
      return bGD - aGD;
    }

    return (b.goalsFor || 0) - (a.goalsFor || 0);
  });

  sortedTeams.forEach(function (team, index) {
    const gf = team.goalsFor || 0;
    const ga = team.goalsAgainst || 0;
    const gd = gf - ga;

    table.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${team.teamName}</td>
        <td>${team.played}</td>
        <td>${team.wins}</td>
        <td>${team.draws}</td>
        <td>${team.losses}</td>
        <td>${gf}</td>
        <td>${ga}</td>
        <td>${gd}</td>
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
        <button onclick="window.manageTeams()">
  👥 Manage Teams
</button>

        <label>Match Format:</label>

        <select id="legFormat">
          <option value="1">1 Leg</option>
          <option value="2">2 Legs</option>
        </select>

        <br><br>

        <button onclick="generateFixtures()">
          📅 Generate / Regenerate Fixtures
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
      </div>
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

  let currentDay = 0;

  fixtures.forEach(function (fixture, index) {

    if (fixture.day !== currentDay) {
      currentDay = fixture.day;

      let dateText = "";

if (leagueStarted && seasonStartDate) {
  const fixtureDate = new Date(seasonStartDate);

  fixtureDate.setDate(
    fixtureDate.getDate() + fixture.day - 1
  );

  dateText = " — " + fixtureDate.toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );
}

fixtureList.innerHTML += `
  <h3 class="match-day">
    📅 Day ${fixture.day}${dateText}
  </h3>
`;
    }

    const match = document.createElement("div");

    match.className = "fixture";

    if (fixture.completed) {
      match.innerHTML = `
        <span class="teams">
          ${fixture.home} 🆚 ${fixture.away}
        </span>

        <strong>
          ${fixture.homeScore} - ${fixture.awayScore}
        </strong>

        <span>✅ Completed</span>
      `;
    } else {
      match.innerHTML = `
        <span class="teams">
          ${fixture.home} 🆚 ${fixture.away}
        </span>

        <button onclick="enterFixtureResult(${index})">
          🏆 Enter Result
        </button>
      `;
    }

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
  seasonStartDate = new Date();
  displayfixtures();

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

  if (fixture.completed) {
    alert("⚠️ This match result has already been entered.");
    return;
  }

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

homeTeam.goalsFor =
  (homeTeam.goalsFor || 0) + homeScore;

homeTeam.goalsAgainst =
  (homeTeam.goalsAgainst || 0) + awayScore;

awayTeam.goalsFor =
  (awayTeam.goalsFor || 0) + awayScore;

awayTeam.goalsAgainst =
  (awayTeam.goalsAgainst || 0) + homeScore;

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

function generateFixtures() {
  if (leagueStarted) {
    alert("🔒 The season has already started.");
    return;
  }

  if (teams.length < 2) {
    alert("❌ You need at least 2 teams.");
    return;
  }

  const legFormat =
    Number(document.getElementById("legFormat").value);

  fixtures.length = 0;

  let teamNames = teams.map(function (team) {
    return team.teamName;
  });

  if (teamNames.length % 2 !== 0) {
    teamNames.push("BYE");
  }

  const totalTeams = teamNames.length;
  const rounds = totalTeams - 1;
  const matchesPerRound = totalTeams / 2;

  for (let round = 0; round < rounds; round++) {

    for (let i = 0; i < matchesPerRound; i++) {

      const home = teamNames[i];
      const away =
        teamNames[totalTeams - 1 - i];

      if (home !== "BYE" && away !== "BYE") {
        fixtures.push({
          day: round + 1,
          home: home,
          away: away,
          completed: false
        });
      }
    }

    teamNames.splice(
      1,
      0,
      teamNames.pop()
    );
  }

  if (legFormat === 2) {

    const firstLeg = [...fixtures];

    firstLeg.forEach(function (fixture) {

      fixtures.push({
        day: fixture.day + rounds,
        home: fixture.away,
        away: fixture.home,
        completed: false
      });

    });
  }

  displayFixtures();

  alert(
    "✅ Fixtures generated!\n\n" +
    fixtures.length +
    " matches created."
  );
}

window.manageTeams = function() {
  if (leagueStarted) {
    alert("🔒 The league has already started. Teams cannot be edited.");
    return;
  }

  if (teams.length === 0) {
    alert("⚠️ No teams registered yet.");
    return;
  }

  let teamListText = "👥 REGISTERED TEAMS\n\n";

  teams.forEach(function (team, index) {
    teamListText +=
      (index + 1) + ". " +
      team.teamName +
      " — " +
      team.playerName +
      "\n";
  });

  const choice = prompt(
    teamListText +
    "\n\nType the team number to edit/remove, or Cancel to exit."
  );

  if (choice === null) {
    return;
  }

  const teamIndex = Number(choice) - 1;

  if (
    isNaN(teamIndex) ||
    teamIndex < 0 ||
    teamIndex >= teams.length
  ) {
    alert("❌ Invalid team number.");
    return;
  }

  const action = prompt(
    "What do you want to do?\n\n" +
    "1 = Edit Team\n" +
    "2 = Remove Team"
  );

  if (action === "1") {
    const newTeamName = prompt(
      "Enter new team name:",
      teams[teamIndex].teamName
    );

    const newPlayerName = prompt(
      "Enter new player name:",
      teams[teamIndex].playerName
    );

    if (!newTeamName || !newPlayerName) {
      alert("⚠️ Team details cannot be empty.");
      return;
    }

    teams[teamIndex].teamName =
      newTeamName.trim();

    teams[teamIndex].playerName =
      newPlayerName.trim();

    displayTeams();
    displayTable();

    alert("✅ Team updated successfully!");

  } else if (action === "2") {

    const confirmRemove = confirm(
      "🗑️ Remove " +
      teams[teamIndex].teamName +
      "?"
    );

    if (!confirmRemove) {
      return;
    }

    teams.splice(teamIndex, 1);

    fixtures.length = 0;

    displayTeams();
    displayTable();
    displayFixtures();

    alert(
      "🗑️ Team removed!\n\n" +
      "Generate the fixtures again before starting the league."
    );
  }
}

window.addEventListener("load", loadTeamsFromCloud);
console.log("🔥 Cloud loading started");
window.showRegister = showRegister;
window.adminLogin = adminLogin;
window.generateFixtures = generateFixtures;
window.startLeague = startLeague;
window.reopenRegistration = reopenRegistration;
window.clearTeams = clearTeams;
window.enterFixtureResult = enterFixtureResult;
