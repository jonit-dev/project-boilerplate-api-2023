import { FriendlyNPCsBlueprint } from "@providers/npc/data/types/npcsBlueprintTypes";
import { npcBaseFixedPath } from "../base/NPCBaseFixedPath";
import { npcBaseRandomPath } from "../base/NPCBaseRandomPath";
import { npcBaseStopped } from "../base/NPCBaseStopped";
import { npcAgatha } from "./NPCAgatha";
import { npcAlice } from "./NPCAlice";
import { npcAnnie } from "./NPCAnnie";
import { npcBlackKnight } from "./NPCBlackKnight";
import { npcBlackKnight2 } from "./NPCBlackKnight2";
import { npcBlackKnight3 } from "./NPCBlackKnight3";
import { npcBlackKnight4 } from "./NPCBlackKnight4";
import { npcCarpenter } from "./NPCCarpenter";
import { npcClimber } from "./NPCClimber";
import { npcDynastyWoman1 } from "./NPCDynastyWoman1";
import { npcDynastyWoman2 } from "./NPCDynastyWoman2";
import { npcFatBaldMan } from "./NPCFatBaldMan";
import { npcFather } from "./NPCFather";
import { npcFelicia } from "./NPCFelicia";
import { npcFisherman } from "./NPCFisherman";
import { npcHumanGirl1 } from "./NPCHumanGirl1";
import { npcHumanGirl2 } from "./NPCHumanGirl2";
import { npcHumanGirl3 } from "./NPCHumanGirl3";
import { npcHumanGirl4 } from "./NPCHumanGirl4";
import { npcHumanMale1 } from "./NPCHumanMale1";
import { npcHumanMale2 } from "./NPCHumanMale2";
import { npcMaleNobleBlackHair } from "./NPCMaleNobleBlackHair";
import { npcMaria } from "./NPCMaria";
import { npcMother } from "./NPCMother";
import { npcSeniorKnight } from "./NPCSeniorKnight1";
import { npcShaman } from "./NPCShaman";
import { npcStoryTeller } from "./NPCStoryTeller";
import { npcSuperiorKnight } from "./NPCSuperiorKnight";
import { npcTrader } from "./NPCTrader";
import { npcTraderHorse } from "./NPCTraderHorse";
import { npcWomanBlueHair } from "./NPCWomanBlueHair";
import { npcWomanGreenHair } from "./NPCWomanGreenHair";

export const friendlyNPCs = {
  [FriendlyNPCsBlueprint.BaseFixedPath]: npcBaseFixedPath,
  [FriendlyNPCsBlueprint.BaseRandomPath]: npcBaseRandomPath,
  [FriendlyNPCsBlueprint.BaseStopped]: npcBaseStopped,
  [FriendlyNPCsBlueprint.Agatha]: npcAgatha,
  [FriendlyNPCsBlueprint.Alice]: npcAlice,
  [FriendlyNPCsBlueprint.Annie]: npcAnnie,
  [FriendlyNPCsBlueprint.Felicia]: npcFelicia,
  [FriendlyNPCsBlueprint.Maria]: npcMaria,
  [FriendlyNPCsBlueprint.BlackKnight]: npcBlackKnight,
  [FriendlyNPCsBlueprint.BlackKnight2]: npcBlackKnight2,
  [FriendlyNPCsBlueprint.BlackKnight3]: npcBlackKnight3,
  [FriendlyNPCsBlueprint.BlackKnight4]: npcBlackKnight4,
  [FriendlyNPCsBlueprint.SuperiorKnight]: npcSuperiorKnight,
  [FriendlyNPCsBlueprint.WomanBlueHair]: npcWomanBlueHair,
  [FriendlyNPCsBlueprint.Trader]: npcTrader,
  [FriendlyNPCsBlueprint.FatBaldMan]: npcFatBaldMan,
  [FriendlyNPCsBlueprint.MaleNobleBlackHair]: npcMaleNobleBlackHair,
  [FriendlyNPCsBlueprint.DynastyWoman1]: npcDynastyWoman1,
  [FriendlyNPCsBlueprint.DynastyWoman2]: npcDynastyWoman2,
  [FriendlyNPCsBlueprint.HumanGirl1]: npcHumanGirl1,
  [FriendlyNPCsBlueprint.HumanGirl2]: npcHumanGirl2,
  [FriendlyNPCsBlueprint.HumanGirl3]: npcHumanGirl3,
  [FriendlyNPCsBlueprint.HumanGirl4]: npcHumanGirl4,
  [FriendlyNPCsBlueprint.HumanMale1]: npcHumanMale1,
  [FriendlyNPCsBlueprint.HumanMale2]: npcHumanMale2,
  [FriendlyNPCsBlueprint.WomanGreenHair]: npcWomanGreenHair,
  [FriendlyNPCsBlueprint.SeniorKnight1]: npcSeniorKnight,
  [FriendlyNPCsBlueprint.Father]: npcFather,
  [FriendlyNPCsBlueprint.Mother]: npcMother,
  [FriendlyNPCsBlueprint.TraderHorse]: npcTraderHorse,
  [FriendlyNPCsBlueprint.Fisherman]: npcFisherman,
  [FriendlyNPCsBlueprint.StoryTeller]: npcStoryTeller,
  [FriendlyNPCsBlueprint.Carpenter]: npcCarpenter,
  [FriendlyNPCsBlueprint.Shaman]: npcShaman,
  [FriendlyNPCsBlueprint.Climber]: npcClimber,
};
