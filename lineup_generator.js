import players from './players.js';

var playerNames = ["Cam Newton", "Le'Veon Bell", "Eddie Lacy", "Paul Richardson", "Randall Cobb", "David Johnson", "Carlos Hyde", "David Johnson", "Devonta Freeman", "LeSean McCoy", "DeMarco Murray", "Dan Bailey", "Matt Bryant", "Ryan Succop", "Tyler Eifert", "Julio Jones", "A.J. Green", "Jordy Nelson", "Marvin Jones Jr.", "Julio Jones", "Kelvin Benjamin", "Jason Witten", "Jordan Reed", "Larry Fitzgerald", "Pierre Garcon", "Ty Montgomery", "Doug Baldwin", "Corey Coleman", "Torrey Smith", "Tyler Eifert", "Delanie Walker", "San Francisco 49ers"];

function createPlayerPool(players="", playerPoolNames = []) {
    var playerPool = playerPoolNames.map(function(name) {
      return players.find(function(player) {
        return player["Nickname"] === name;
      });
    });

    return playerPool;
}

function createLineups(numberOfLineups = 2, playerPool, salary, positions = ["QB", "RB", "WR", "TE", "K", "D"]) {
    var lineups = [];
    var posSegmentedPlayerPool = {};
    
    positions.forEach((pos) => {
      posSegmentedPlayerPool[pos] = playerPool.filter(filterByPosition, pos);
    });

    while (lineups.length < numberOfLineups) {
        var lineup = {};
        var qb = getRandomElem(posSegmentedPlayerPool.QB);
        var rb1 = getRandomElem(posSegmentedPlayerPool.RB);
        var rb2 = getRandomElem(posSegmentedPlayerPool.RB, rb1.takenPlayer);
        var wr1 = getRandomElem(posSegmentedPlayerPool.WR);
        var wr2 = getRandomElem(posSegmentedPlayerPool.WR, wr1.takenPlayer);
        var wr3 = getRandomElem(posSegmentedPlayerPool.WR, wr1.takenPlayer, wr2.takenPlayer);
        var te = getRandomElem(posSegmentedPlayerPool.TE);
        var k = getRandomElem(posSegmentedPlayerPool.K);
        var d = getRandomElem(posSegmentedPlayerPool.D);

        // construct lineup
        lineup.QB = qb.player;
        lineup.RB = [
          rb1.player,
          rb2.player
        ];
        lineup.WR = [
          wr1.player,
          wr2.player,
          wr3.player
        ];
        lineup.TE = te.player;
        lineup.K = k.player;
        lineup.D = d.player;

        // compute cost
        var lineupArray = Object.values(lineup);
        var lineupCost = 0;

        lineupArray.forEach((pos) => {

          if (Array.isArray(pos)) {
            pos.forEach((player) => {
              lineupCost += parseInt(player["Salary"]);
            }); 
          } else {
            lineupCost += parseInt(pos["Salary"]);
          }
        });

        lineup["cost"] = lineupCost;

        if (lineupCost <= salary && !lineups.includes(lineup)) {
          lineups.push(lineup);
        }

    }

    return lineups;
}

function getRandomElem(myArray, takenPlayer, takenPlayer2) {
  var randPos = Math.floor(Math.random() * myArray.length);

  if (takenPlayer !== undefined) {
    if (takenPlayer2 !== undefined) {
      while (randPos === takenPlayer || randPos === takenPlayer2) {
        randPos = Math.floor(Math.random() * myArray.length);
      }
    } else {
      while (randPos === takenPlayer) {
        randPos = Math.floor(Math.random() * myArray.length);
      }
    }
  }

  return { 
    player: myArray[randPos],
    takenPlayer: randPos
  };
}

function filterByPosition(player) {
  if (player) return player["Position"] === this.toString();
}

function drawLineups(lineups) {
  var lineupsTable = document.querySelector('#lineups tbody');

  lineups.forEach((lineup) => {
    var tr = `<tr>
        <td>${lineup.QB.Nickname}</td>
        <td>${lineup.RB[0].Nickname}</td>
        <td>${lineup.RB[1].Nickname}</td>
        <td>${lineup.WR[0].Nickname}</td>
        <td>${lineup.WR[1].Nickname}</td>
        <td>${lineup.WR[2].Nickname}</td>
        <td>${lineup.TE.Nickname}</td>
        <td>${lineup.K.Nickname}</td>
        <td>${lineup.D.Nickname}</td>
        <td>${lineup.cost}</td>
        <td><input type="checkbox" value="${[
            lineup.QB.Id,
            lineup.RB[0].Id,
            lineup.RB[1].Id,
            lineup.WR[0].Id,
            lineup.WR[1].Id,
            lineup.WR[2].Id,
            lineup.TE.Id,
            lineup.K.Id,
            lineup.D.Id
          ]}" /></td>
      </tr>`;

    lineupsTable.insertAdjacentHTML('beforeend', tr);
  });
}

var playerPool = createPlayerPool(players, playerNames);

drawLineups(createLineups(20, playerPool, 60000));

window.downloadCSV = (fileName="player_bunch") => {
  var link, data, filename;
  var lineupArray = ["data:text/csv;charset=utf-8, QB, RB, RB, WR, WR, WR, TE, K, D"];

  document.querySelectorAll(":checked").forEach(function (lineup, index) {
      lineupArray.push(lineup.value);
  });

  var csvContent = lineupArray.join("\n");

  data = encodeURI(csvContent);
  link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', fileName);
  link.click();
}
