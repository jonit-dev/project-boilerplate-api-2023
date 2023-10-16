import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { EntityType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterSpellLifeSteal } from "./CharacterSpellLifeSteal";
import { NPCSpellLifeSteal } from "./NPCSpellLifeSteal";

@provide(SpellLifeSteal)
export class SpellLifeSteal {
  constructor(private npcSpellLifeSteal: NPCSpellLifeSteal, private characterSpellLifeSteal: CharacterSpellLifeSteal) {}

  @TrackNewRelicTransaction()
  public async performLifeSteal(caster: ICharacter | INPC, target: ICharacter | INPC): Promise<void> {
    switch (caster.type) {
      case EntityType.NPC:
        await this.npcSpellLifeSteal.performLifeSteal(caster as INPC, target as ICharacter);
        break;
      case EntityType.Character:
        await this.characterSpellLifeSteal.performLifeSteal(caster as ICharacter, target as ICharacter | INPC);
        break;
    }
  }
}
