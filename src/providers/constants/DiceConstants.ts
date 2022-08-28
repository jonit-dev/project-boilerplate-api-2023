export enum Dice {
  D4 = Math.floor(Math.random() * (Math.floor(5) - Math.ceil(1)) + 1),
  D6 = Math.floor(Math.random() * (Math.floor(7) - Math.ceil(1)) + 1),
  D8 = Math.floor(Math.random() * (Math.floor(9) - Math.ceil(1)) + 1),
  D10 = Math.floor(Math.random() * (Math.floor(11) - Math.ceil(1)) + 1),
  D12 = Math.floor(Math.random() * (Math.floor(13) - Math.ceil(1)) + 1),
  D20 = Math.floor(Math.random() * (Math.floor(21) - Math.ceil(1)) + 1),
}
