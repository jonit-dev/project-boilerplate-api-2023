// @ts-nocheck
// const map = require("../public/maps/ilya.json");
// const map = require("../public/maps/dwarf-mines.json");
const timeOffsetByMin = 10;
const serverStartTime = "2022-09-25T11:00:00.000";
const gameStartTime = "2022-01-01T09:00:00.000";
const dawnStartsAtHour = 7;
const nightfallStartsAtHour = 18;
let serverStart = new Date();
let gameStart = new Date();
let gameNow = "";
let gameNowDate = "";
function startClock() {
  if (!timeOffsetByMin)
    throw new Error("Cannot start clock if real time to game time offset constant is not configured");

  // Let's get the start starting time, maybe this can be sincronized with a NTP server?
  serverStart = new Date(serverStartTime);
  gameStart = new Date(gameStartTime);

  console.log(`server time is: ${serverStart}`);
  console.log(`game time is: ${gameStart}`);
  // Configure date as well to track day 1 of the server and increment?
}

function sincronizeClock() {
  // Get game and server start dates and return the actual game time
  const dateNow = Date.now() - serverStart.getTime();
  gameNow = dateNow * timeOffsetByMin + gameStart.getTime();
  gameNowDate = new Date(gameNow);
  console.log(new Date());
  console.log(serverStart, dateNow, dateNow);
  console.log(gameStart, gameNow, new Date(gameNow));

  const formatted = {
    timestmap: gameNowDate,
    year: gameNowDate.getFullYear(),
    month: gameNowDate.getMonth(),
    day: gameNowDate.getDay(),
    hour: gameNowDate.getHours(),
    minute: gameNowDate.getMinutes(),
    second: gameNowDate.getSeconds(),
  };

  console.log(formatted);
}

function getDayOrNight() {
  const gameHour = gameNowDate.getHours();
  if (gameHour >= dawnStartsAtHour && gameHour <= nightfallStartsAtHour) {
    console.log("day");
  } else {
    console.log("night");
  }
}

startClock();
sincronizeClock();
getDayOrNight();
