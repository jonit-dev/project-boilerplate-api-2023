import { HostileNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { npcAssaultSpider } from "./NPCAssaultSpider";
import { npcBandit } from "./NPCBandit";
import { npcBat } from "./NPCBat";
import { npcBlackEagle } from "./NPCBlackEagle";
import { npcBlackSpider } from "./NPCBlackSpider";
import { npcBrownBear } from "./NPCBrownBear";
import { npcCaveSpider } from "./NPCCaveSpider";
import { npcCaveTroll } from "./NPCCaveTroll";
import { npcCentipede } from "./NPCCentipede";
import { npcDwarf } from "./NPCDwarf";
import { npcDwarfArcher } from "./NPCDwarfArcher";
import { npcDwarfGuard } from "./NPCDwarfGuard";
import { npcDwarfGuardian } from "./NPCDwarfGuardian";
import { npcDwarfMage } from "./NPCDwarfMage";
import { npcElderGolem } from "./NPCElderGolem";
import { npcElf } from "./NPCElf";
import { npcFireFox } from "./NPCFireFox";
import { npcForestTroll } from "./NPCForestTroll";
import { npcForestWalker } from "./NPCForestWalker";
import { npcFrostSalamander } from "./NPCFrostSalamander";
import { npcGhost } from "./NPCGhost";
import { npcGhoul } from "./NPCGhoul";
import { npcGiantBat } from "./NPCGiantBat";
import { npcGiantSpider } from "./NPCGiantSpider";
import { npcGoblin } from "./NPCGoblin";
import { npcIceFox } from "./NPCIceFox";
import { npcIceTroll } from "./NPCIceTroll";
import { npcMinotaur } from "./NPCMinotaur";
import { npcMudGolem } from "./NPCMudGolem";
import { npcOrc } from "./NPCOrc";
import { npcOrcBerserker } from "./NPCOrcBerserker";
import { npcOrcMage } from "./NPCOrcMage";
import { npcOrcWarrior } from "./NPCOrcWarrior";
import { npcPandaBear } from "./NPCPandaBear";
import { npcPolarBear } from "./NPCPolarBear";
import { npcRaccoon } from "./NPCRaccoon";
import { npcRat } from "./NPCRat";
import { npcRedCentipede } from "./NPCRedCentipede";
import { npcRedDragon } from "./NPCRedDragon";
import { npcScorpion } from "./NPCScorpion";
import { npcSkeleton } from "./NPCSkeleton";
import { npcSkeletonKnight } from "./NPCSkeletonKnight";
import { npcSlime } from "./NPCSlime";
import { npcSnake } from "./NPCSnake";
import { npcSparrow } from "./NPCSparrow";
import { npcSpider } from "./NPCSpider";
import { npcSpiderling } from "./NPCSpiderling";
import { npcStoneGolem } from "./NPCStoneGolem";
import { npcTroll } from "./NPCTroll";
import { npcTrollBerserker } from "./NPCTrollBerserker";
import { npcTrollWarrior } from "./NPCTrollWarrior";
import { npcWildTroll } from "./NPCWildTroll";
import { npcWinterWolf } from "./NPCWinterWolf";
import { npcWolf } from "./NPCWolf";
import { npcYeti } from "./NPCYeti";

export const hostileNPCs = {
  [HostileNPCsBlueprint.Orc]: npcOrc,
  [HostileNPCsBlueprint.OrcWarrior]: npcOrcWarrior,
  [HostileNPCsBlueprint.OrcBerserker]: npcOrcBerserker,
  [HostileNPCsBlueprint.OrcMage]: npcOrcMage,
  [HostileNPCsBlueprint.Skeleton]: npcSkeleton,
  [HostileNPCsBlueprint.Rat]: npcRat,
  [HostileNPCsBlueprint.SkeletonKnight]: npcSkeletonKnight,
  [HostileNPCsBlueprint.Bat]: npcBat,
  [HostileNPCsBlueprint.Ghost]: npcGhost,
  [HostileNPCsBlueprint.Minotaur]: npcMinotaur,
  [HostileNPCsBlueprint.Slime]: npcSlime,
  [HostileNPCsBlueprint.Wolf]: npcWolf,
  [HostileNPCsBlueprint.Ghoul]: npcGhoul,
  [HostileNPCsBlueprint.Spider]: npcSpider,
  [HostileNPCsBlueprint.Dwarf]: npcDwarf,
  [HostileNPCsBlueprint.DwarfGuard]: npcDwarfGuard,
  [HostileNPCsBlueprint.RedDragon]: npcRedDragon,
  [HostileNPCsBlueprint.Troll]: npcTroll,
  [HostileNPCsBlueprint.WildTroll]: npcWildTroll,
  [HostileNPCsBlueprint.TrollWarrior]: npcTrollWarrior,
  [HostileNPCsBlueprint.TrollBerserker]: npcTrollBerserker,
  [HostileNPCsBlueprint.ForestTroll]: npcForestTroll,
  [HostileNPCsBlueprint.CaveTroll]: npcCaveTroll,
  [HostileNPCsBlueprint.Goblin]: npcGoblin,
  [HostileNPCsBlueprint.BrownBear]: npcBrownBear,
  [HostileNPCsBlueprint.PandaBear]: npcPandaBear,
  [HostileNPCsBlueprint.PolarBear]: npcPolarBear,
  [HostileNPCsBlueprint.WinterWolf]: npcWinterWolf,
  [HostileNPCsBlueprint.FrostSalamander]: npcFrostSalamander,
  [HostileNPCsBlueprint.Bandit]: npcBandit,
  [HostileNPCsBlueprint.Yeti]: npcYeti,
  [HostileNPCsBlueprint.IceTroll]: npcIceTroll,
  [HostileNPCsBlueprint.Scorpion]: npcScorpion,
  [HostileNPCsBlueprint.BlackSpider]: npcBlackSpider,
  [HostileNPCsBlueprint.AssaultSpider]: npcAssaultSpider,
  [HostileNPCsBlueprint.CaveSpider]: npcCaveSpider,
  [HostileNPCsBlueprint.Centipede]: npcCentipede,
  [HostileNPCsBlueprint.ElderGolem]: npcElderGolem,
  [HostileNPCsBlueprint.FireFox]: npcFireFox,
  [HostileNPCsBlueprint.ForestWalker]: npcForestWalker,
  [HostileNPCsBlueprint.GiantBat]: npcGiantBat,
  [HostileNPCsBlueprint.IceFox]: npcIceFox,
  [HostileNPCsBlueprint.MudGolem]: npcMudGolem,
  [HostileNPCsBlueprint.Raccoon]: npcRaccoon,
  [HostileNPCsBlueprint.RedCentipede]: npcRedCentipede,
  [HostileNPCsBlueprint.Sparrow]: npcSparrow,
  [HostileNPCsBlueprint.Snake]: npcSnake,
  [HostileNPCsBlueprint.Spiderling]: npcSpiderling,
  [HostileNPCsBlueprint.StoneGolem]: npcStoneGolem,
  [HostileNPCsBlueprint.Elf]: npcElf,
  [HostileNPCsBlueprint.GiantSpider]: npcGiantSpider,
  [HostileNPCsBlueprint.BlackEagle]: npcBlackEagle,
  [HostileNPCsBlueprint.DwarfArcher]: npcDwarfArcher,
  [HostileNPCsBlueprint.DwarfGuardian]: npcDwarfGuardian,
  [HostileNPCsBlueprint.DwarfMage]: npcDwarfMage,
};
