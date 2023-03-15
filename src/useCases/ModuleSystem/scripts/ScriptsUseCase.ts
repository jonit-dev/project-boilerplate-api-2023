import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { Depot } from "@entities/ModuleDepot/DepotModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { SpellLearn } from "@providers/spells/SpellLearn";
import { FromGridX, FromGridY, ICharacter } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

@provide(ScriptsUseCase)
export class ScriptsUseCase {
  constructor(private spellLearn: SpellLearn) {}

  public async setAllBaseSpeedsToStandard(): Promise<void> {
    try {
      await Character.updateMany(
        {},
        {
          $set: {
            baseSpeed: MovementSpeed.Standard,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  public async adjustInitialCoordinates(): Promise<void> {
    try {
      await Character.updateMany(
        {},
        {
          $set: {
            x: FromGridX(110),
            y: FromGridY(106),
            initialX: FromGridX(110),
            initialY: FromGridY(106),
            scene: "ilya",
          },
        }
      );
    } catch (error) {
      console.error(error);

      throw new BadRequestError("Failed to execute script!");
    }
  }

  public async eaglesEyeFix(): Promise<void> {
    const characters = await Character.find({});

    for (const character of characters) {
      const characterSpells = character.learnedSpells;

      const removeWrongName = _.filter(characterSpells, (item) => {
        return item !== "speel-eagle-eyes";
      });

      if (_.isEqual(removeWrongName, characterSpells)) {
        return;
      }

      (await Character.findByIdAndUpdate(
        { _id: character._id },
        { learnedSpells: removeWrongName }
      )) as unknown as ICharacter;
    }
  }

  public async fixWrongDepot(): Promise<void> {
    const characters = await Character.find({});

    for (const character of characters) {
      const depots = await Depot.find({ owner: character._id });

      for (const depot of depots) {
        const itemContainer = await ItemContainer.findById(depot.itemContainer);

        if (!itemContainer) {
          await depot.remove();
        }

        if (!itemContainer?.slots) {
          await depot.remove();
          await itemContainer?.remove();
        }
      }
    }
  }
}
