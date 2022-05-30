import { Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { provide } from "inversify-binding-decorators";

@provide(NPCDeath)
export class NPCDeath {
  public async generateNPCBody(npc: INPC): Promise<void> {
    const blueprintData = itemsBlueprintIndex["female-npc-body"];

    const npcBody = new Item({
      ...blueprintData,
      name: `${npc.name}'s body`,
      scene: npc.scene,
      x: npc.x,
      y: npc.y,
    });

    await npcBody.save();
  }
}
