import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemStuddedShield } from "./tier0/ItemStuddedShield";
import { itemWoodenShield } from "./tier0/ItemWoodenShield";
import { itemBanditShield } from "./tier1/ItemBanditShield";
import { itemHeaterShield } from "./tier1/ItemHeaterShield";
import { itemVikingShield } from "./tier1/ItemVikingShield";
import { itemPaladinsSafeguardShield } from "./tier10/ItemPaladinsSafeguardShield";
import { itemDwarvenShield } from "./tier2/ItemDwarvenShield";
import { itemFrostShield } from "./tier2/ItemFrostShield";
import { itemKiteShield } from "./tier2/ItemKiteShield";
import { itemSpikedShield } from "./tier2/ItemSpikedShield";
import { itemStoneShield } from "./tier2/ItemStoneShield";
import { itemEnergyShield } from "./tier3/ItemEnergyShield";
import { itemFalconsShield } from "./tier3/ItemFalconsShield";
import { itemForceShield } from "./tier3/ItemForceShield";
import { itemPaviseShield } from "./tier3/ItemPaviseShield";
import { itemPlateShield } from "./tier3/ItemPlateShield";
import { itemScutumShield } from "./tier3/ItemScutumShield";
import { itemTowerShield } from "./tier3/ItemTowerShield";
import { itemYetiShield } from "./tier3/ItemYetiShield";
import { itemDarkShield } from "./tier4/ItemDarkShield";
import { itemHolyShield } from "./tier4/ItemHolyShield";
import { itemKnightsShield } from "./tier4/ItemKnightsShield";
import { itemSilverShield } from "./tier4/ItemSilverShield";
import { itemCrimsonAegisShield } from "./tier5/ItemCrimsonAegisShield";
import { itemDemonShield } from "./tier5/ItemDemonShield";
import { itemIronHeartShield } from "./tier6/ItemIronHeartShield";
import { itemWardenOfTheWoods } from "./tier7/ItemWardenOfTheWoods";
import { itemTemporalRoundShield } from "./tier8/ItemTemporalRoundShield";
import { itemBladeBarrier } from "./tier9/ItemBladeBarrier";

export const shieldsBlueprintIndex = {
  [ShieldsBlueprint.FrostShield]: itemFrostShield,
  [ShieldsBlueprint.KnightsShield]: itemKnightsShield,
  [ShieldsBlueprint.PlateShield]: itemPlateShield,
  [ShieldsBlueprint.ScutumShield]: itemScutumShield,
  [ShieldsBlueprint.SilverShield]: itemSilverShield,
  [ShieldsBlueprint.StuddedShield]: itemStuddedShield,
  [ShieldsBlueprint.VikingShield]: itemVikingShield,
  [ShieldsBlueprint.WoodenShield]: itemWoodenShield,
  [ShieldsBlueprint.YetiShield]: itemYetiShield,
  [ShieldsBlueprint.DarkShield]: itemDarkShield,
  [ShieldsBlueprint.DemonShield]: itemDemonShield,
  [ShieldsBlueprint.EnergyShield]: itemEnergyShield,
  [ShieldsBlueprint.ForceShield]: itemForceShield,
  [ShieldsBlueprint.HeaterShield]: itemHeaterShield,
  [ShieldsBlueprint.HolyShield]: itemHolyShield,
  [ShieldsBlueprint.KiteShield]: itemKiteShield,
  [ShieldsBlueprint.PaviseShield]: itemPaviseShield,
  [ShieldsBlueprint.SpikedShield]: itemSpikedShield,
  [ShieldsBlueprint.StoneShield]: itemStoneShield,
  [ShieldsBlueprint.TowerShield]: itemTowerShield,
  [ShieldsBlueprint.BanditShield]: itemBanditShield,
  [ShieldsBlueprint.CrimsonAegisShield]: itemCrimsonAegisShield,
  [ShieldsBlueprint.DwarvenShield]: itemDwarvenShield,
  [ShieldsBlueprint.FalconsShield]: itemFalconsShield,
  [ShieldsBlueprint.TemporalRoundShield]: itemTemporalRoundShield,
  [ShieldsBlueprint.IronHeartShield]: itemIronHeartShield,
  [ShieldsBlueprint.WardenOfTheWoods]: itemWardenOfTheWoods,
  [ShieldsBlueprint.BladeBarrier]: itemBladeBarrier,
  [ShieldsBlueprint.PaladinsSafeguardShield]: itemPaladinsSafeguardShield,
};
