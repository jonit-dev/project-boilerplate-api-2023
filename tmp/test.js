const map = require("../public/maps/ilya.json");

const layer = map.layers.filter((e) => e.name === "ground")[0];

let heightTotal = 0;
let widthTotal = 0;
let chunkCount = 0;

for (const chunk of layer.chunks) {
  heightTotal += chunk.height;
  widthTotal += chunk.width;
  chunkCount++;
  // console.log(chunk);
}

console.log(heightTotal, heightTotal / chunkCount);
console.log(widthTotal, widthTotal / chunkCount);
console.log(chunkCount);
