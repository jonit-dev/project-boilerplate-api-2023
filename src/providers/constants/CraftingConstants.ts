export const CRAFTING_MIN_LEVEL_RATIO = 3.5;

// remember this regulates mining, blacksmithing, fishing, etc.
export const CRAFTING_DIFFICULTY_RATIO = 1.75; // higher means harder
export const CRAFTING_BASE_CHANCE_IMPACT = 0.75; // higher means easier

export const CRAFTING_ITEMS_CHANCE = 60; // base chance for crafting items with ingredients. higher means higher easier

//! Not working yet due to a bug where you can craft items without all ingredients if on nested bag. Need to solve this first.
export const CRAFTING_FAILED_TRY_SP_INCREASE_RATIO = 0.1; // higher means easier. 0.2 = 20% is how much sp is increased when a crafting attempt fails, comparing to a full success (100%)
