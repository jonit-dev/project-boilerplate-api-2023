// const map = require("../public/maps/ilya.json");
// const map = require("../public/maps/dwarf-mines.json");
const map = require("../public/maps/unit-test-map-negative-coordinate.json");

const layer = map.layers.filter((e) => e.name === "ground")[0];

let chunkCount = 0;
const xcoord = [];
const ycoord = [];
let chunkXSize = 0;
let chunkYSize = 0;

for (const chunk of layer.chunks) {
  if (!xcoord.includes(chunk.x)) xcoord.push(chunk.x);
  if (!ycoord.includes(chunk.y)) ycoord.push(chunk.y);
  chunkCount++;
  chunkXSize = chunk.height;
  chunkYSize = chunk.width;
}

console.log(xcoord);
console.log(ycoord);
console.log(chunkCount);
console.log("calculated map width:", xcoord.length * chunkXSize);
console.log("calculated map height:", ycoord.length * chunkYSize);

// 344 largura - 352
// 264 altura - 336

// 21,8 - largura - 23
// 16,8 - altura - 17
