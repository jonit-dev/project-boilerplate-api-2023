import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { BlueprintManager } from "@providers/blueprint/BlueprintManager";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { spellsBlueprints } from "@providers/spells/data/blueprints";
import { ISpell, MagicPower, SpellsBlueprint } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { random } from "lodash";

export interface ISpellAreaNPC {
  spellKey: SpellsBlueprint;
  probability: number;
  power: MagicPower;
}

@provide(NPCSpellArea)
export class NPCSpellArea {
  constructor(private blueprintManager: BlueprintManager, private movementHelper: MovementHelper) {}

  @TrackNewRelicTransaction()
  public async castNPCSpell(attacker: INPC, target: ICharacter | INPC): Promise<boolean | undefined> {
    try {
      const npcBlueprint = (await this.blueprintManager.getBlueprint("npcs", attacker.baseKey as any)) as Record<
        string,
        unknown
      >;

      if (!npcBlueprint) {
        return false;
      }

      const areaSpells = npcBlueprint?.areaSpells as ISpellAreaNPC[];

      if (!areaSpells?.length) {
        return false;
      }

      // choose randomly one of the areaSpells available
      const areaSpell = areaSpells[random(0, areaSpells.length - 1)];

      // check probability to cast the area spell
      const n = random(0, 100);

      if (n > areaSpell.probability) {
        return false;
      }

      const spell = spellsBlueprints[areaSpell.spellKey] as ISpell;

      if (!spell) {
        throw new Error(`Spell ${areaSpell.spellKey} not found!`);
      }

      const attackInRange = this.movementHelper.isUnderRange(
        attacker.x,
        attacker.y,
        target.x,
        target.y,
        spell.maxDistanceGrid || 0
      );

      if (!attackInRange) {
        return false;
      }

      await spell.usableEffect(attacker, target);

      return true;
    } catch (error) {
      console.error(error);
    }
  }
}
