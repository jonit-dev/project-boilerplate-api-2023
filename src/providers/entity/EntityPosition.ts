import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { MapHelper } from "@providers/map/MapHelper";
import { SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import { GRID_HEIGHT, GRID_WIDTH, SOCKET_TRANSMISSION_ZONE_WIDTH } from "@rpg-engine/shared";

import { provide } from "inversify-binding-decorators";

export type IStorableEntity = ICharacter | INPC | IItem;

export type StorableEntityTypes = "npcs" | "characters" | "items";

export interface IEntityPosition {
  _id: string;
  x: number;
  y: number;
  scene: string;
  direction?: string;
  lastMovement?: Date;
}

@provide(EntityPosition)
export class EntityPosition {
  constructor(
    private inMemoryHashTable: InMemoryHashTable,
    private socketTransmissionZone: SocketTransmissionZone,
    private mapHelper: MapHelper
  ) {}

  public async setEntityPosition(entity: IStorableEntity, type: StorableEntityTypes): Promise<boolean> {
    try {
      let newEntity = this.prepareEntity(entity);
      this.validateEntity(newEntity);

      let payload = {
        _id: newEntity.id,
        x: newEntity.x,
        y: newEntity.y,
        scene: newEntity.scene,
      } as IEntityPosition;

      if (type === "characters") {
        newEntity = newEntity as ICharacter;
        payload = {
          ...payload,
          direction: newEntity.direction,
          lastMovement: new Date(),
        };
      }

      await this.inMemoryHashTable.set(`entity-positions:${newEntity.scene}:${type}`, newEntity.id, payload);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private prepareEntity(entity: IStorableEntity): IStorableEntity {
    entity.id = (entity._id || entity.id)?.toString();
    entity._id = (entity._id || entity.id)?.toString();
    return entity;
  }

  private validateEntity(entity: IStorableEntity): void {
    if (!entity.id) {
      throw new Error("Entity does not have an id");
    }

    if (!entity.scene) {
      throw new Error("Entity does not have a scene");
    }
  }

  public async updateEntityPosition(
    entity: IStorableEntity,
    type: StorableEntityTypes,
    dataToUpdate: Partial<IEntityPosition>
  ): Promise<void> {
    if (!entity.scene) {
      throw new Error("Entity does not have a scene");
    }

    const foundEntity = await this.inMemoryHashTable.get(`entity-positions:${entity.scene}:${type}`, entity._id);

    if (!foundEntity) {
      return undefined;
    }

    const updatedEntityPosition = {
      ...foundEntity,
      ...dataToUpdate,
    } as IEntityPosition;

    await this.inMemoryHashTable.set(`entity-positions:${entity.scene}:${type}`, entity._id, updatedEntityPosition);
  }

  public async getEntityPosition(
    entity: IStorableEntity,
    type: StorableEntityTypes
  ): Promise<IEntityPosition | undefined> {
    if (!entity?.scene) {
      return;
    }

    return (await this.inMemoryHashTable.get(
      `entity-positions:${entity.scene}:${type}`,
      entity._id
    )) as IEntityPosition;
  }

  public async deleteEntityPosition(entity: IStorableEntity, type: StorableEntityTypes): Promise<boolean> {
    if (!entity) {
      throw new Error("Failed to delete entity from position: Entity is undefined");
    }

    if (!entity.scene) {
      throw new Error("Entity does not have a scene");
    }

    try {
      await this.inMemoryHashTable.delete(`entity-positions:${entity.scene}:${type}`, entity._id);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  public async clearAll(): Promise<void> {
    const allKeys = await this.inMemoryHashTable.getAllKeysWithPrefix("entity-positions:");
    for (const key of allKeys) {
      await this.inMemoryHashTable.deleteAll(key);
    }
  }

  public async syncEntityPosition(entity: IStorableEntity, type: StorableEntityTypes): Promise<void> {
    const entityPosition = await this.getEntityPosition(entity, type);

    if (!entityPosition) {
      return;
    }

    switch (type) {
      case "characters":
        const character = entity as ICharacter;

        await Character.findByIdAndUpdate(character._id, entityPosition);

        break;
    }
  }

  public async syncAllEntityPositions(): Promise<void> {
    try {
      console.info("🔒 Saving all entity positions...");

      // Retrieve all keys in the inMemoryHashTable which correspond to entity positions
      const allEntitiesKeys = await this.inMemoryHashTable.getAllKeysWithPrefix("entity-positions:");

      // Iterate over all entities
      for (const entityKey of allEntitiesKeys) {
        // Parse out the scene and the type from the key
        // @ts-ignore
        const [_prefix, scene, type, id] = entityKey.split(":");

        // Check if it's a type we're interested in (here just "characters")
        if (type === "characters") {
          // Retrieve the current entity
          const entity = (await this.inMemoryHashTable.get(`entity-positions:${scene}:${type}`, id)) as IStorableEntity;

          // Call the `syncEntityPosition` method for the current entity
          await this.syncEntityPosition(entity, type as StorableEntityTypes);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async getAllEntitiesFromScene(scene: string, type: StorableEntityTypes): Promise<IEntityPosition[]> {
    const entityData = (await this.inMemoryHashTable.getAll(`entity-positions:${scene}:${type}`)) as Record<
      string,
      IEntityPosition
    >;

    if (!entityData) {
      return [];
    }

    const entities = Object.values(entityData);

    return entities;
  }

  public async getEntitiesInView(
    x: number,
    y: number,
    scene: string,
    type: StorableEntityTypes
  ): Promise<IEntityPosition[]> {
    if (!type) {
      throw new Error("Type is required");
    }

    const entities = await this.getAllEntitiesFromScene(scene, type);

    const socketTransmissionZone = this.socketTransmissionZone.calculateSocketTransmissionZone(
      x,
      y,
      GRID_WIDTH,
      GRID_HEIGHT,
      SOCKET_TRANSMISSION_ZONE_WIDTH,
      SOCKET_TRANSMISSION_ZONE_WIDTH
    );

    const entitiesInView = entities.filter((entity) => {
      if (!this.mapHelper.isCoordinateValid(entity?.x) || !this.mapHelper.isCoordinateValid(entity?.y)) {
        throw new Error("Entity does not have a position");
      }

      const isInBoundingBox = this.isInBoundingBox(entity, socketTransmissionZone);

      if (isInBoundingBox) {
        return true;
      }

      return false;
    });

    return entitiesInView as IEntityPosition[];
  }

  private isInBoundingBox(entity, zone): boolean {
    const inXRange = entity.x >= zone.x && entity.x <= zone.width;
    const inYRange = entity.y >= zone.y && entity.y <= zone.height;

    return inXRange && inYRange;
  }
}
