import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { BlueprintManager } from "@providers/blueprint/BlueprintManager";
import { EffectsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

@provide(BattleEffects)
export class BattleEffects {
  constructor(private newRelic: NewRelic, private blueprintManager: BlueprintManager) {}

  public async generateBloodOnGround(target: ICharacter | INPC): Promise<void> {
    await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "BattleEffects.generateBloodOnGround",
      async () => {
        const groundBloodBlueprint = await this.blueprintManager.getBlueprint<IItem>(
          "items",
          EffectsBlueprint.GroundBlood
        );

        const newGroundBlood = new Item({
          ...groundBloodBlueprint,
          x: target.x,
          y: target.y,
          scene: target.scene,
          texturePath: `blood-floor/red-blood-${_.random(1, 3)}.png`,
          name: `${target.name}'s blood`,
        });

        await newGroundBlood.save();
      }
    );
  }
}
