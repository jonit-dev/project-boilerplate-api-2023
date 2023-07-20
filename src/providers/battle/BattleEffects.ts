import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { TrackClassExecutionTime } from "@jonit-dev/decorators-utils";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { blueprintManager } from "@providers/inversify/container";
import { EffectsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

@provide(BattleEffects)
@TrackClassExecutionTime()
export class BattleEffects {
  private groundBloodBlueprint: IItem | null = null;

  constructor() {}

  @TrackNewRelicTransaction()
  public async generateBloodOnGround(target: ICharacter | INPC): Promise<void> {
    if (!this.groundBloodBlueprint) {
      this.groundBloodBlueprint = await blueprintManager.getBlueprint<IItem>("items", EffectsBlueprint.GroundBlood);
    }
    const newGroundBlood = new Item({
      ...this.groundBloodBlueprint,
      x: target.x,
      y: target.y,
      scene: target.scene,
      texturePath: `blood-floor/red-blood-${_.random(1, 3)}.png`,
      name: `${target.name}'s blood`,
    });

    await newGroundBlood.save();
  }
}
