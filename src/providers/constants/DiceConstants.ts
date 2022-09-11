export enum Dice {
  D4 = 4,
  D6 = 6,
  D8 = 8,
  D12 = 12,
  D20 = 20,
}

export function rollDice(dice: Dice): number {
  const max = Math.floor(dice);
  const min = 1;

  const diceNumber = Math.floor(Math.random() * (max - min) + min);

  return diceNumber;
}
