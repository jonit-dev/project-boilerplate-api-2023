import {
  IEquippableArmorBlueprint,
  IEquippableItemBlueprint,
  IEquippableRangedWeaponOneHandedBlueprint,
  IEquippableRangedWeaponTwoHandedBlueprint,
  IEquippableStaffBlueprint,
  IEquippableWeaponBlueprint,
} from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "./itemsBlueprintTypes";

// Accessory ========================================

export type AccessoryTier0Attack = 0 | 1 | 2 | 3;
export type AccessoryTier0Defense = 0 | 1 | 2 | 3;

export type AccessoryTier1Attack = AccessoryTier0Attack | 4 | 5 | 6;
export type AccessoryTier1Defense = AccessoryTier0Defense | 4 | 5 | 6;

export type AccessoryTier2Attack = AccessoryTier1Attack | 7 | 8 | 9;
export type AccessoryTier2Defense = AccessoryTier1Defense | 7 | 8 | 9;

export interface IEquippableAccessoryTier0Blueprint extends IEquippableItemBlueprint {
  tier: 0;
  attack: AccessoryTier0Attack;
  defense: AccessoryTier0Defense;
}

export interface IEquippableAccessoryTier1Blueprint extends IEquippableItemBlueprint {
  tier: 1;
  attack: AccessoryTier1Attack;
  defense: AccessoryTier1Defense;
}

export interface IEquippableAccessoryTier2Blueprint extends IEquippableItemBlueprint {
  tier: 2;
  attack: AccessoryTier2Attack;
  defense: AccessoryTier2Defense;
}

// Melee ========================================

export type WeaponTier0Attack = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type WeaponTier0Defense = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type WeaponTier1Attack = WeaponTier0Attack | 9 | 10 | 11 | 12 | 13 | 14 | 15;
export type WeaponTier1Defense = WeaponTier0Defense | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export type WeaponTier2Attack = WeaponTier1Attack | 16 | 17 | 18 | 19 | 20 | 21 | 22;
export type WeaponTier2Defense = WeaponTier1Defense | 16 | 17 | 18 | 19 | 20 | 21 | 22;

export type WeaponTier3Attack = WeaponTier2Attack | 23 | 24 | 25 | 26 | 27 | 28 | 29;
export type WeaponTier3Defense = WeaponTier2Defense | 23 | 24 | 25 | 26 | 27 | 28 | 29;

export type WeaponTier4Attack = WeaponTier3Attack | 30 | 31 | 32 | 33 | 34 | 35 | 36;
export type WeaponTier4Defense = WeaponTier3Defense | 30 | 31 | 32 | 33 | 34 | 35 | 36;

export type WeaponTier5Attack = WeaponTier4Attack | 37 | 38 | 39 | 40 | 41 | 42 | 43;
export type WeaponTier5Defense = WeaponTier4Defense | 37 | 38 | 39 | 40 | 41 | 42 | 43;

export type WeaponTier6Attack = WeaponTier5Attack | 44 | 45 | 46 | 47 | 48 | 49 | 50;
export type WeaponTier6Defense = WeaponTier5Defense | 44 | 45 | 46 | 47 | 48 | 49 | 50;

export type WeaponTier7Attack = WeaponTier6Attack | 51 | 52 | 53 | 54 | 55 | 56 | 57;
export type WeaponTier7Defense = WeaponTier6Defense | 51 | 52 | 53 | 54 | 55 | 56 | 57;

export type WeaponTier8Attack = WeaponTier7Attack | 58 | 59 | 60 | 61 | 62 | 63 | 64;
export type WeaponTier8Defense = WeaponTier7Defense | 58 | 59 | 60 | 61 | 62 | 63 | 64;

export type WeaponTier9Attack = WeaponTier8Attack | 65 | 66 | 67 | 68 | 69 | 70 | 71;
export type WeaponTier9Defense = WeaponTier8Defense | 65 | 66 | 67 | 68 | 69 | 70 | 71;

export type WeaponTier10Attack = WeaponTier9Attack | 72 | 73 | 74 | 75 | 76 | 77 | 78;
export type WeaponTier10Defense = WeaponTier9Defense | 72 | 73 | 74 | 75 | 76 | 77 | 78;

export type WeaponTier11Attack = WeaponTier10Attack | 79 | 80 | 81 | 82 | 83 | 84 | 85;
export type WeaponTier11Defense = WeaponTier10Defense | 79 | 80 | 81 | 82 | 83 | 84 | 85;

export type WeaponTier12Attack = WeaponTier11Attack | 86 | 87 | 88 | 89 | 90 | 91 | 92;
export type WeaponTier12Defense = WeaponTier11Defense | 86 | 87 | 88 | 89 | 90 | 91 | 92;

export type WeaponTier13Attack = WeaponTier12Attack | 93 | 94 | 95 | 96 | 97 | 98 | 99;
export type WeaponTier13Defense = WeaponTier12Defense | 93 | 94 | 95 | 96 | 97 | 98 | 99;

export type WeaponTier14Attack = WeaponTier13Attack | 100 | 101 | 102 | 103 | 104 | 105 | 106;
export type WeaponTier14Defense = WeaponTier13Defense | 100 | 101 | 102 | 103 | 104 | 105 | 106;

export type WeaponTier15Attack = WeaponTier14Attack | 107 | 108 | 109 | 110 | 111 | 112 | 113;
export type WeaponTier15Defense = WeaponTier14Defense | 107 | 108 | 109 | 110 | 111 | 112 | 113;

export type WeaponTier16Attack = WeaponTier15Attack | 114 | 115 | 116 | 117 | 118 | 119 | 120;
export type WeaponTier16Defense = WeaponTier15Defense | 114 | 115 | 116 | 117 | 118 | 119 | 120;

export interface IEquippableMeleeTier0WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 0;
  attack: WeaponTier0Attack;
  defense: WeaponTier0Defense;
}

export interface IEquippableMeleeTier1WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 1;
  attack: WeaponTier1Attack;
  defense: WeaponTier1Defense;
}

export interface IEquippableMeleeTier2WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 2;
  attack: WeaponTier2Attack;
  defense: WeaponTier2Defense;
}

export interface IEquippableMeleeTier3WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 3;
  attack: WeaponTier3Attack;
  defense: WeaponTier3Defense;
}

export interface IEquippableMeleeTier4WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 4;
  attack: WeaponTier4Attack;
  defense: WeaponTier4Defense;
}

export interface IEquippableMeleeTier5WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 5;
  attack: WeaponTier5Attack;
  defense: WeaponTier5Defense;
}

export interface IEquippableMeleeTier6WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 6;
  attack: WeaponTier6Attack;
  defense: WeaponTier6Defense;
}

export interface IEquippableMeleeTier7WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 7;
  attack: WeaponTier7Attack;
  defense: WeaponTier7Defense;
}

export interface IEquippableMeleeTier8WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 8;
  attack: WeaponTier8Attack;
  defense: WeaponTier8Defense;
}

export interface IEquippableMeleeTier9WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 9;
  attack: WeaponTier9Attack;
  defense: WeaponTier9Defense;
}

export interface IEquippableMeleeTier10WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 10;
  attack: WeaponTier10Attack;
  defense: WeaponTier10Defense;
}

export interface IEquippableMeleeTier11WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 11;
  attack: WeaponTier11Attack;
  defense: WeaponTier11Defense;
}

export interface IEquippableMeleeTier12WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 12;
  attack: WeaponTier12Attack;
  defense: WeaponTier12Defense;
}

export interface IEquippableMeleeTier13WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 13;
  attack: WeaponTier13Attack;
  defense: WeaponTier13Defense;
}

export interface IEquippableMeleeTier14WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 14;
  attack: WeaponTier14Attack;
  defense: WeaponTier14Defense;
}

export interface IEquippableMeleeTier15WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 15;
  attack: WeaponTier15Attack;
  defense: WeaponTier15Defense;
}

// 2 handed ========================================

export type TwoHandedWeaponTier0Attack = 0 | 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16;
export type TwoHandedWeaponTier0Defense = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type TwoHandedWeaponTier1Attack = TwoHandedWeaponTier0Attack | 18 | 20 | 22 | 24 | 26 | 28 | 30;
export type TwoHandedWeaponTier1Defense = TwoHandedWeaponTier0Defense | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export type TwoHandedWeaponTier2Attack = TwoHandedWeaponTier1Attack | 32 | 34 | 36 | 38 | 40 | 42 | 44;
export type TwoHandedWeaponTier2Defense = TwoHandedWeaponTier1Defense | 16 | 17 | 18 | 19 | 20 | 21 | 22;

export type TwoHandedWeaponTier3Attack = TwoHandedWeaponTier2Attack | 46 | 48 | 50 | 52 | 54 | 56 | 58;
export type TwoHandedWeaponTier3Defense = TwoHandedWeaponTier2Defense | 23 | 24 | 25 | 26 | 27 | 28 | 29;

export type TwoHandedWeaponTier4Attack = TwoHandedWeaponTier3Attack | 62 | 64 | 66 | 68 | 70 | 72 | 74;
export type TwoHandedWeaponTier4Defense = TwoHandedWeaponTier3Defense | 30 | 31 | 32 | 33 | 34 | 35 | 36;

export type TwoHandedWeaponTier5Attack = TwoHandedWeaponTier4Attack | 78 | 80 | 82 | 84 | 86 | 88 | 90;
export type TwoHandedWeaponTier5Defense = TwoHandedWeaponTier4Defense | 37 | 38 | 39 | 40 | 41 | 42 | 43;

export type TwoHandedWeaponTier6Attack = TwoHandedWeaponTier5Attack | 94 | 96 | 98 | 100 | 102 | 104 | 106;
export type TwoHandedWeaponTier6Defense = TwoHandedWeaponTier5Defense | 44 | 45 | 46 | 47 | 48 | 49 | 50;

export type TwoHandedWeaponTier7Attack = TwoHandedWeaponTier6Attack | 110 | 112 | 114 | 116 | 118 | 120 | 122;
export type TwoHandedWeaponTier7Defense = TwoHandedWeaponTier6Defense | 51 | 52 | 53 | 54 | 55 | 56 | 57;

export type TwoHandedWeaponTier8Attack = TwoHandedWeaponTier7Attack | 126 | 128 | 130 | 132 | 134 | 136 | 138;
export type TwoHandedWeaponTier8Defense = TwoHandedWeaponTier7Defense | 58 | 59 | 60 | 61 | 62 | 63 | 64;

export type TwoHandedWeaponTier9Attack = TwoHandedWeaponTier8Attack | 142 | 144 | 146 | 148 | 150 | 152 | 154;
export type TwoHandedWeaponTier9Defense = TwoHandedWeaponTier8Defense | 65 | 66 | 67 | 68 | 69 | 70 | 71;

export interface IEquippableTwoHandedTier0WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 0;
  attack: TwoHandedWeaponTier0Attack;
  defense: TwoHandedWeaponTier0Defense;
  isTwoHanded: true;
}

export interface IEquippableTwoHandedTier1WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 1;
  attack: TwoHandedWeaponTier1Attack;
  defense: TwoHandedWeaponTier1Defense;
  isTwoHanded: true;
}

export interface IEquippableTwoHandedTier2WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 2;
  attack: TwoHandedWeaponTier2Attack;
  defense: TwoHandedWeaponTier2Defense;
  isTwoHanded: true;
}

export interface IEquippableTwoHandedTier3WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 3;
  attack: TwoHandedWeaponTier3Attack;
  defense: TwoHandedWeaponTier3Defense;
  isTwoHanded: true;
}

export interface IEquippableTwoHandedTier4WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 4;
  attack: TwoHandedWeaponTier4Attack;
  defense: TwoHandedWeaponTier4Defense;
  isTwoHanded: true;
}

export interface IEquippableTwoHandedTier5WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 5;
  attack: TwoHandedWeaponTier5Attack;
  defense: TwoHandedWeaponTier5Defense;
  isTwoHanded: true;
}

export interface IEquippableTwoHandedTier6WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 6;
  attack: TwoHandedWeaponTier6Attack;
  defense: TwoHandedWeaponTier6Defense;
  isTwoHanded: true;
}

export interface IEquippableTwoHandedTier7WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 7;
  attack: TwoHandedWeaponTier7Attack;
  defense: TwoHandedWeaponTier7Defense;
  isTwoHanded: true;
}

export interface IEquippableTwoHandedTier8WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 8;
  attack: TwoHandedWeaponTier8Attack;
  defense: TwoHandedWeaponTier8Defense;
  isTwoHanded: true;
}
export interface IEquippableTwoHandedTier9WeaponBlueprint extends IEquippableWeaponBlueprint {
  tier: 9;
  attack: TwoHandedWeaponTier9Attack;
  defense: TwoHandedWeaponTier9Defense;
  isTwoHanded: true;
}

// Ranged ========================================

type Tier0AmmoKeys =
  | [RangedWeaponsBlueprint.Arrow | RangedWeaponsBlueprint.Stone | RangedWeaponsBlueprint.WoodenArrow]
  | [RangedWeaponsBlueprint.Bolt];
type Tier1AmmoKeys =
  | [RangedWeaponsBlueprint.Arrow, RangedWeaponsBlueprint.IronArrow]
  | [RangedWeaponsBlueprint.Bolt, RangedWeaponsBlueprint.ElvenBolt];
type Tier2AmmoKeys =
  | Tier1AmmoKeys
  | [RangedWeaponsBlueprint.Arrow, RangedWeaponsBlueprint.IronArrow, RangedWeaponsBlueprint.FrostArrow];
type Tier3AmmoKeys =
  | [
      RangedWeaponsBlueprint.Arrow,
      RangedWeaponsBlueprint.IronArrow,
      RangedWeaponsBlueprint.PoisonArrow,
      RangedWeaponsBlueprint.FrostArrow
    ]
  | [RangedWeaponsBlueprint.Bolt, RangedWeaponsBlueprint.ElvenBolt, RangedWeaponsBlueprint.FireBolt];
type Tier4AmmoKeys =
  | [
      RangedWeaponsBlueprint.Arrow,
      RangedWeaponsBlueprint.IronArrow,
      RangedWeaponsBlueprint.PoisonArrow,
      RangedWeaponsBlueprint.ShockArrow
    ]
  | [
      RangedWeaponsBlueprint.Bolt,
      RangedWeaponsBlueprint.ElvenBolt,
      RangedWeaponsBlueprint.FireBolt,
      RangedWeaponsBlueprint.CorruptionBolt
    ];

type Tier5AmmoKeys =
  | [
      RangedWeaponsBlueprint.Arrow,
      RangedWeaponsBlueprint.IronArrow,
      RangedWeaponsBlueprint.PoisonArrow,
      RangedWeaponsBlueprint.ShockArrow,
      RangedWeaponsBlueprint.GoldenArrow,
      RangedWeaponsBlueprint.EmeraldArrow,
      RangedWeaponsBlueprint.CrimsonArrow
    ]
  | [
      RangedWeaponsBlueprint.Bolt,
      RangedWeaponsBlueprint.ElvenBolt,
      RangedWeaponsBlueprint.FireBolt,
      RangedWeaponsBlueprint.CorruptionBolt
    ];

type Tier6AmmoKeys =
  | [
      RangedWeaponsBlueprint.Arrow,
      RangedWeaponsBlueprint.IronArrow,
      RangedWeaponsBlueprint.PoisonArrow,
      RangedWeaponsBlueprint.ShockArrow,
      RangedWeaponsBlueprint.GoldenArrow,
      RangedWeaponsBlueprint.EmeraldArrow,
      RangedWeaponsBlueprint.CrimsonArrow,
      RangedWeaponsBlueprint.WardenArrow,
      RangedWeaponsBlueprint.SunflareArrow
    ]
  | [
      RangedWeaponsBlueprint.Bolt,
      RangedWeaponsBlueprint.ElvenBolt,
      RangedWeaponsBlueprint.FireBolt,
      RangedWeaponsBlueprint.CorruptionBolt,
      RangedWeaponsBlueprint.GossamerBolt
    ];

type Tier7AmmoKeys =
  | [
      RangedWeaponsBlueprint.Arrow,
      RangedWeaponsBlueprint.IronArrow,
      RangedWeaponsBlueprint.PoisonArrow,
      RangedWeaponsBlueprint.ShockArrow,
      RangedWeaponsBlueprint.GoldenArrow,
      RangedWeaponsBlueprint.EmeraldArrow,
      RangedWeaponsBlueprint.CrimsonArrow,
      RangedWeaponsBlueprint.WardenArrow,
      RangedWeaponsBlueprint.SunflareArrow,
      RangedWeaponsBlueprint.EarthArrow,
      RangedWeaponsBlueprint.SilvermoonArrow
    ]
  | [
      RangedWeaponsBlueprint.Bolt,
      RangedWeaponsBlueprint.ElvenBolt,
      RangedWeaponsBlueprint.FireBolt,
      RangedWeaponsBlueprint.CorruptionBolt,
      RangedWeaponsBlueprint.GossamerBolt
    ];

type Tier8AmmoKeys =
  | [
      RangedWeaponsBlueprint.Arrow,
      RangedWeaponsBlueprint.IronArrow,
      RangedWeaponsBlueprint.PoisonArrow,
      RangedWeaponsBlueprint.ShockArrow,
      RangedWeaponsBlueprint.GoldenArrow,
      RangedWeaponsBlueprint.EmeraldArrow,
      RangedWeaponsBlueprint.CrimsonArrow,
      RangedWeaponsBlueprint.WardenArrow,
      RangedWeaponsBlueprint.SunflareArrow,
      RangedWeaponsBlueprint.EarthArrow,
      RangedWeaponsBlueprint.SilvermoonArrow
    ]
  | [
      RangedWeaponsBlueprint.Bolt,
      RangedWeaponsBlueprint.ElvenBolt,
      RangedWeaponsBlueprint.FireBolt,
      RangedWeaponsBlueprint.CorruptionBolt,
      RangedWeaponsBlueprint.GossamerBolt,
      RangedWeaponsBlueprint.CursedBolt
    ];

type Tier9AmmoKeys =
  | [
      RangedWeaponsBlueprint.Arrow,
      RangedWeaponsBlueprint.IronArrow,
      RangedWeaponsBlueprint.PoisonArrow,
      RangedWeaponsBlueprint.ShockArrow,
      RangedWeaponsBlueprint.GoldenArrow,
      RangedWeaponsBlueprint.EmeraldArrow,
      RangedWeaponsBlueprint.CrimsonArrow,
      RangedWeaponsBlueprint.WardenArrow,
      RangedWeaponsBlueprint.SunflareArrow,
      RangedWeaponsBlueprint.EarthArrow,
      RangedWeaponsBlueprint.SilvermoonArrow
    ]
  | [
      RangedWeaponsBlueprint.Bolt,
      RangedWeaponsBlueprint.ElvenBolt,
      RangedWeaponsBlueprint.FireBolt,
      RangedWeaponsBlueprint.CorruptionBolt,
      RangedWeaponsBlueprint.GossamerBolt,
      RangedWeaponsBlueprint.CursedBolt
    ];

type Tier10AmmoKeys =
  | [
      RangedWeaponsBlueprint.Arrow,
      RangedWeaponsBlueprint.IronArrow,
      RangedWeaponsBlueprint.PoisonArrow,
      RangedWeaponsBlueprint.ShockArrow,
      RangedWeaponsBlueprint.GoldenArrow,
      RangedWeaponsBlueprint.EmeraldArrow,
      RangedWeaponsBlueprint.CrimsonArrow,
      RangedWeaponsBlueprint.WardenArrow,
      RangedWeaponsBlueprint.SunflareArrow,
      RangedWeaponsBlueprint.EarthArrow,
      RangedWeaponsBlueprint.SilvermoonArrow,
      RangedWeaponsBlueprint.HeartseekerArrow
    ]
  | [
      RangedWeaponsBlueprint.Bolt,
      RangedWeaponsBlueprint.ElvenBolt,
      RangedWeaponsBlueprint.FireBolt,
      RangedWeaponsBlueprint.CorruptionBolt,
      RangedWeaponsBlueprint.GossamerBolt,
      RangedWeaponsBlueprint.CursedBolt
    ];

type Tier11AmmoKeys =
  | [
      RangedWeaponsBlueprint.Arrow,
      RangedWeaponsBlueprint.IronArrow,
      RangedWeaponsBlueprint.PoisonArrow,
      RangedWeaponsBlueprint.ShockArrow,
      RangedWeaponsBlueprint.GoldenArrow,
      RangedWeaponsBlueprint.EmeraldArrow,
      RangedWeaponsBlueprint.CrimsonArrow,
      RangedWeaponsBlueprint.WardenArrow,
      RangedWeaponsBlueprint.SunflareArrow,
      RangedWeaponsBlueprint.EarthArrow,
      RangedWeaponsBlueprint.SilvermoonArrow,
      RangedWeaponsBlueprint.HeartseekerArrow,
      RangedWeaponsBlueprint.SeekerArrow,
      RangedWeaponsBlueprint.CrystallineArrow
    ]
  | [
      RangedWeaponsBlueprint.Bolt,
      RangedWeaponsBlueprint.ElvenBolt,
      RangedWeaponsBlueprint.FireBolt,
      RangedWeaponsBlueprint.CorruptionBolt,
      RangedWeaponsBlueprint.GossamerBolt,
      RangedWeaponsBlueprint.CursedBolt
    ];

type Tier12AmmoKeys =
  | [
      RangedWeaponsBlueprint.Arrow,
      RangedWeaponsBlueprint.IronArrow,
      RangedWeaponsBlueprint.PoisonArrow,
      RangedWeaponsBlueprint.ShockArrow,
      RangedWeaponsBlueprint.GoldenArrow,
      RangedWeaponsBlueprint.EmeraldArrow,
      RangedWeaponsBlueprint.CrimsonArrow,
      RangedWeaponsBlueprint.WardenArrow,
      RangedWeaponsBlueprint.SunflareArrow,
      RangedWeaponsBlueprint.EarthArrow,
      RangedWeaponsBlueprint.SilvermoonArrow,
      RangedWeaponsBlueprint.HeartseekerArrow,
      RangedWeaponsBlueprint.SeekerArrow,
      RangedWeaponsBlueprint.CrystallineArrow
    ]
  | [
      RangedWeaponsBlueprint.Bolt,
      RangedWeaponsBlueprint.ElvenBolt,
      RangedWeaponsBlueprint.FireBolt,
      RangedWeaponsBlueprint.CorruptionBolt,
      RangedWeaponsBlueprint.GossamerBolt,
      RangedWeaponsBlueprint.CursedBolt
    ];

export interface IEquippableRangedTier0WeaponBlueprint extends IEquippableRangedWeaponTwoHandedBlueprint {
  tier: 0;
  attack: WeaponTier0Attack;
  requiredAmmoKeys: Tier0AmmoKeys;
}

export interface IEquippableRangedTier1WeaponBlueprint extends IEquippableRangedWeaponTwoHandedBlueprint {
  tier: 1;
  attack: WeaponTier1Attack;
  requiredAmmoKeys: Tier1AmmoKeys;
}

export interface IEquippableRangedTier2WeaponBlueprint extends IEquippableRangedWeaponTwoHandedBlueprint {
  tier: 2;
  attack: WeaponTier2Attack;
  requiredAmmoKeys: Tier2AmmoKeys;
}

export interface IEquippableRangedTier3WeaponBlueprint extends IEquippableRangedWeaponTwoHandedBlueprint {
  tier: 3;
  attack: WeaponTier3Attack;
  requiredAmmoKeys: Tier3AmmoKeys;
}

export interface IEquippableRangedTier4WeaponBlueprint extends IEquippableRangedWeaponTwoHandedBlueprint {
  tier: 4;
  attack: WeaponTier4Attack;
  requiredAmmoKeys: Tier4AmmoKeys;
}

export interface IEquippableRangedTier5WeaponBlueprint extends IEquippableRangedWeaponTwoHandedBlueprint {
  tier: 5;
  attack: WeaponTier5Attack;
  requiredAmmoKeys: Tier5AmmoKeys;
}
export interface IEquippableRangedTier6WeaponBlueprint extends IEquippableRangedWeaponTwoHandedBlueprint {
  tier: 6;
  attack: WeaponTier6Attack;
  requiredAmmoKeys: Tier6AmmoKeys;
}
export interface IEquippableRangedTier7WeaponBlueprint extends IEquippableRangedWeaponTwoHandedBlueprint {
  tier: 7;
  attack: WeaponTier7Attack;
  requiredAmmoKeys: Tier7AmmoKeys;
}

export interface IEquippableRangedTier8WeaponBlueprint extends IEquippableRangedWeaponTwoHandedBlueprint {
  tier: 8;
  attack: WeaponTier8Attack;
  requiredAmmoKeys: Tier8AmmoKeys;
}

export interface IEquippableRangedTier9WeaponBlueprint extends IEquippableRangedWeaponTwoHandedBlueprint {
  tier: 9;
  attack: WeaponTier9Attack;
  requiredAmmoKeys: Tier9AmmoKeys;
}

export interface IEquippableRangedTier10WeaponBlueprint extends IEquippableRangedWeaponTwoHandedBlueprint {
  tier: 10;
  attack: WeaponTier10Attack;
  requiredAmmoKeys: Tier10AmmoKeys;
}

export interface IEquippableRangedTier11WeaponBlueprint extends IEquippableRangedWeaponTwoHandedBlueprint {
  tier: 11;
  attack: WeaponTier11Attack;
  requiredAmmoKeys: Tier11AmmoKeys;
}

export interface IEquippableRangedTier12WeaponBlueprint extends IEquippableRangedWeaponTwoHandedBlueprint {
  tier: 12;
  attack: WeaponTier12Attack;
  requiredAmmoKeys: Tier12AmmoKeys;
}

export interface IEquippableOneHandedRangedTier0WeaponBlueprint extends IEquippableRangedWeaponOneHandedBlueprint {
  tier: 0;
  attack: WeaponTier0Attack;
}

export interface IEquippableOneHandedRangedTier1WeaponBlueprint extends IEquippableRangedWeaponOneHandedBlueprint {
  tier: 1;
  attack: WeaponTier1Attack;
}

export interface IEquippableOneHandedRangedTier2WeaponBlueprint extends IEquippableRangedWeaponOneHandedBlueprint {
  tier: 2;
  attack: WeaponTier2Attack;
}

export interface IEquippableOneHandedRangedTier3WeaponBlueprint extends IEquippableRangedWeaponOneHandedBlueprint {
  tier: 3;
  attack: WeaponTier3Attack;
}

export interface IEquippableOneHandedRangedTier4WeaponBlueprint extends IEquippableRangedWeaponOneHandedBlueprint {
  tier: 4;
  attack: WeaponTier4Attack;
}

export interface IEquippableOneHandedRangedTier5WeaponBlueprint extends IEquippableRangedWeaponOneHandedBlueprint {
  tier: 5;
  attack: WeaponTier5Attack;
}

// Staffs ========================================

export interface IEquippableTwoHandedStaffTier0WeaponBlueprint extends IEquippableStaffBlueprint {
  tier: 0;
  attack: WeaponTier0Attack;
  defense: WeaponTier0Defense;
}

export interface IEquippableTwoHandedStaffTier1WeaponBlueprint extends IEquippableStaffBlueprint {
  tier: 1;
  attack: WeaponTier1Attack;
  defense: WeaponTier1Defense;
}

export interface IEquippableTwoHandedStaffTier2WeaponBlueprint extends IEquippableStaffBlueprint {
  tier: 2;
  attack: WeaponTier2Attack;
  defense: WeaponTier2Defense;
}

export interface IEquippableTwoHandedStaffTier3WeaponBlueprint extends IEquippableStaffBlueprint {
  tier: 3;
  attack: WeaponTier3Attack;
  defense: WeaponTier3Defense;
}

export interface IEquippableTwoHandedStaffTier4WeaponBlueprint extends IEquippableStaffBlueprint {
  tier: 4;
  attack: WeaponTier4Attack;
  defense: WeaponTier4Defense;
}

export interface IEquippableTwoHandedStaffTier5WeaponBlueprint extends IEquippableStaffBlueprint {
  tier: 5;
  attack: WeaponTier5Attack;
  defense: WeaponTier5Defense;
}

export interface IEquippableTwoHandedStaffTier6WeaponBlueprint extends IEquippableStaffBlueprint {
  tier: 6;
  attack: WeaponTier6Attack;
  defense: WeaponTier6Defense;
}

export interface IEquippableTwoHandedStaffTier7WeaponBlueprint extends IEquippableStaffBlueprint {
  tier: 7;
  attack: WeaponTier7Attack;
  defense: WeaponTier7Defense;
}
export interface IEquippableTwoHandedStaffTier8WeaponBlueprint extends IEquippableStaffBlueprint {
  tier: 8;
  attack: WeaponTier8Attack;
  defense: WeaponTier8Defense;
}

export interface IEquippableTwoHandedStaffTier9WeaponBlueprint extends IEquippableStaffBlueprint {
  tier: 9;
  attack: WeaponTier9Attack;
  defense: WeaponTier9Defense;
}

export interface IEquippableTwoHandedStaffTier10WeaponBlueprint extends IEquippableStaffBlueprint {
  tier: 10;
  attack: WeaponTier10Attack;
  defense: WeaponTier10Defense;
}

export interface IEquippableTwoHandedStaffTier11WeaponBlueprint extends IEquippableStaffBlueprint {
  tier: 11;
  attack: WeaponTier11Attack;
  defense: WeaponTier11Defense;
}

export interface IEquippableTwoHandedStaffTier12WeaponBlueprint extends IEquippableStaffBlueprint {
  tier: 12;
  attack: WeaponTier12Attack;
  defense: WeaponTier12Defense;
}
export interface IEquippableTwoHandedStaffTier13WeaponBlueprint extends IEquippableStaffBlueprint {
  tier: 13;
  attack: WeaponTier13Attack;
  defense: WeaponTier13Defense;
}

export interface IEquippableTwoHandedStaffTier14WeaponBlueprint extends IEquippableStaffBlueprint {
  tier: 14;
  attack: WeaponTier14Attack;
  defense: WeaponTier14Defense;
}

export interface IEquippableTwoHandedStaffTier15WeaponBlueprint extends IEquippableStaffBlueprint {
  tier: 15;
  attack: WeaponTier15Attack;
  defense: WeaponTier15Defense;
}

export interface IEquippableTwoHandedStaffTier16WeaponBlueprint extends IEquippableStaffBlueprint {
  tier: 16;
  attack: WeaponTier16Attack;
  defense: WeaponTier16Defense;
}

// Armors ========================================
export type Tier0ArmorDefense = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Tier1ArmorDefense = Tier0ArmorDefense | 9 | 10 | 11 | 12 | 13 | 14 | 15;
export type Tier2ArmorDefense = Tier1ArmorDefense | 16 | 17 | 18 | 19 | 20 | 21 | 22;
export type Tier3ArmorDefense = Tier2ArmorDefense | 23 | 24 | 25 | 26 | 27 | 28 | 29;
export type Tier4ArmorDefense = Tier3ArmorDefense | 30 | 31 | 32 | 33 | 34 | 35 | 36;
export type Tier5ArmorDefense = Tier4ArmorDefense | 37 | 38 | 39 | 40 | 41 | 42 | 43;
export type Tier6ArmorDefense = Tier5ArmorDefense | 44 | 45 | 46 | 47 | 48 | 49 | 50;

export type Tier7ArmorDefense = Tier5ArmorDefense | 51 | 52 | 53 | 54 | 55 | 56 | 57;

export type Tier8ArmorDefense = Tier5ArmorDefense | 58 | 59 | 60 | 61 | 62 | 63 | 64;

export type Tier9ArmorDefense = Tier5ArmorDefense | 65 | 66 | 67 | 68 | 69 | 70 | 71;

export type Tier10ArmorDefense = Tier5ArmorDefense | 72 | 73 | 74 | 75 | 76 | 77 | 78;

export interface IEquippableArmorTier0Blueprint extends IEquippableArmorBlueprint {
  tier: 0;
  defense: Tier0ArmorDefense;
}

export interface IEquippableArmorTier1Blueprint extends IEquippableArmorBlueprint {
  tier: 1;
  defense: Tier1ArmorDefense;
}

export interface IEquippableArmorTier2Blueprint extends IEquippableArmorBlueprint {
  tier: 2;
  defense: Tier2ArmorDefense;
}

export interface IEquippableArmorTier3Blueprint extends IEquippableArmorBlueprint {
  tier: 3;
  defense: Tier3ArmorDefense;
}

export interface IEquippableArmorTier4Blueprint extends IEquippableArmorBlueprint {
  tier: 4;
  defense: Tier4ArmorDefense;
}

export interface IEquippableArmorTier5Blueprint extends IEquippableArmorBlueprint {
  tier: 5;
  defense: Tier5ArmorDefense;
}

export interface IEquippableArmorTier6Blueprint extends IEquippableArmorBlueprint {
  tier: 6;
  defense: Tier6ArmorDefense;
}

export interface IEquippableArmorTier7Blueprint extends IEquippableArmorBlueprint {
  tier: 7;
  defense: Tier7ArmorDefense;
}

export interface IEquippableArmorTier8Blueprint extends IEquippableArmorBlueprint {
  tier: 8;
  defense: Tier8ArmorDefense;
}

export interface IEquippableArmorTier9Blueprint extends IEquippableArmorBlueprint {
  tier: 9;
  defense: Tier9ArmorDefense;
}

export interface IEquippableArmorTier10Blueprint extends IEquippableArmorBlueprint {
  tier: 10;
  defense: Tier10ArmorDefense;
}

// Light Armor ========================================

export type LightArmorTier0Defense = 0 | 1 | 2 | 3 | 4;
export type LightArmorTier1Defense = LightArmorTier0Defense | 5 | 6 | 7;
export type LightArmorTier2Defense = LightArmorTier1Defense | 8 | 9 | 10;
export type LightArmorTier3Defense = LightArmorTier2Defense | 11 | 12 | 13 | 14 | 15 | 16;
export type LightArmorTier4Defense = LightArmorTier3Defense | 17 | 18 | 19 | 20 | 21 | 22;

export interface IEquippableLightArmorTier0Blueprint extends IEquippableArmorBlueprint {
  tier: 0;
  defense: LightArmorTier0Defense;
}

export interface IEquippableLightArmorTier1Blueprint extends IEquippableArmorBlueprint {
  tier: 1;
  defense: LightArmorTier1Defense;
}

export interface IEquippableLightArmorTier2Blueprint extends IEquippableArmorBlueprint {
  tier: 2;
  defense: LightArmorTier2Defense;
}

export interface IEquippableLightArmorTier3Blueprint extends IEquippableArmorBlueprint {
  tier: 3;
  defense: LightArmorTier3Defense;
}

export interface IEquippableLightArmorTier4Blueprint extends IEquippableArmorBlueprint {
  tier: 4;
  defense: LightArmorTier4Defense;
}
