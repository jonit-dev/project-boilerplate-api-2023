/* eslint-disable promise/always-return */
/* eslint-disable no-void */
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { EntityEffectUse } from "@providers/entityEffects/EntityEffectUse";
import { IEntityEffect } from "@providers/entityEffects/data/blueprints/entityEffect";
import { IPosition } from "@providers/movement/MovementHelper";
import { PVP_MIN_REQUIRED_LV } from "@providers/constants/PVPConstants";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import {
  AnimationEffectKeys,
  EntityType,
  FromGridX,
  FromGridY,
  MagicPower,
  ToGridX,
  ToGridY,
  NPCAlignment,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { HitTarget } from "../../battle/HitTarget";
import { MapNonPVPZone } from "@providers/map/MapNonPVPZone";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterSkull } from "@providers/character/CharacterSkull";
import { RaidManager } from "@providers/raid/RaidManager";
import { CharacterParty, ICharacterParty } from "@entities/ModuleCharacter/CharacterPartyModel";

interface IAffectedTarget {
  target: ICharacter[] | INPC[];
  intensity: number; // spell area grid can have different intensity coefficient on different areas of the grid, e.g., more intense effect on the center
}

export interface ISpellAreaEffect {
  cells: IPosition[]; // cells affected by the spell. Use this for animation effects
  targets: IAffectedTarget[]; // NPCs and Characters reached by the spell
}

interface ISpellAreaCalculateEffectOptions {
  includeCaster?: boolean;
  excludeEntityTypes: EntityType[];
}

interface ISpellAreaCastOptions {
  effectAnimationKey: AnimationEffectKeys;
  entityEffect?: IEntityEffect;
  isAttackSpell?: boolean;
  noCastInNonPvP?: boolean;
  spellAreaGrid: number[][];
  customFn?: (target: ICharacter | INPC, intensity: number) => Promise<void> | void; // use case is for example for healing targets, instead of killing them
  includeCaster?: boolean;
  excludeEntityTypes?: EntityType[];
}

@provide(SpellArea)
export class SpellArea {
  constructor(
    private entityEffectUse: EntityEffectUse,
    private hitTarget: HitTarget,
    private animationEffect: AnimationEffect,
    private mapNonPVPZone: MapNonPVPZone,
    private socketMessaging: SocketMessaging,
    private characterSkull: CharacterSkull,
    private raidManager: RaidManager
  ) {}

  @TrackNewRelicTransaction()
  public async cast(
    caster: ICharacter | INPC,
    target: ICharacter | INPC,
    magicPower: MagicPower,
    options: ISpellAreaCastOptions
  ): Promise<void> {
    const { spellAreaGrid, effectAnimationKey } = options;
    options.isAttackSpell = "isAttackSpell" in options ? options.isAttackSpell : true;
    options.noCastInNonPvP = "noCastInNonPvP" in options ? options.noCastInNonPvP : false;

    const calculateEffectOptions: ISpellAreaCalculateEffectOptions = {
      includeCaster: options.includeCaster,
      excludeEntityTypes: options.excludeEntityTypes || [],
    };

    const { cells: animationCells, targets } = await this.calculateEffect(
      caster,
      {
        x: ToGridX(target.x),
        y: ToGridY(target.y),
      },
      spellAreaGrid,
      calculateEffectOptions
    );

    if (
      caster.type === EntityType.Character &&
      options.noCastInNonPvP === true &&
      this.mapNonPVPZone.isNonPVPZoneAtXY(caster.scene, caster.x, caster.y)
    ) {
      // Checks if the caster is a Character, if the noCastInNonPvP option is active, and if the caster is in a non-PvP zone
      const errorMessage = "This spell cannot be cast in a non-PvP zone";
      this.socketMessaging.sendErrorMessageToCharacter(caster as ICharacter, errorMessage);
      return;
    }

    const hitPromises = targets.map(async (target) => {
      const targetToHit = target.target as unknown as ICharacter | INPC;
      const targetIntensity = target.intensity;

      if (caster.type === EntityType.NPC && targetToHit.type === EntityType.NPC) {
        return; // avoid NPCs hitting each other
      }

      if (
        caster.type === EntityType.Character &&
        targetToHit.type === EntityType.NPC &&
        (targetToHit as INPC).alignment === NPCAlignment.Friendly
      ) {
        return; // avoid Characters hitting friendly NPCs
      }

      if (targetToHit.type === EntityType.NPC) {
        const npcTarget = targetToHit as INPC;
        if (npcTarget.raidKey) {
          const isRaidActive = await this.raidManager.isRaidActive(npcTarget.raidKey);
          if (!isRaidActive) {
            return; // avoid Characters hitting Raid NPCs
          }
        }
      }

      if (options?.isAttackSpell !== false) {
        // Checks if the option isAttackSpell is not equal to false
        if (caster.type === EntityType.Character && targetToHit.type === EntityType.Character) {
          async function getLevel(targetToHit: ICharacter | INPC): Promise<number | null> {
            try {
              if ("skills" in targetToHit && targetToHit.skills) {
                const skills = await Skill.findById(targetToHit.skills);
                if (skills) {
                  return skills.level;
                } else {
                  return null;
                }
              } else {
                return null;
              }
            } catch (error) {
              return null;
            }
          }

          const targetLevel = await getLevel(targetToHit);
          if (targetLevel !== null) {
            if (targetLevel < PVP_MIN_REQUIRED_LV) {
              // If the level is lower than PVP_MIN_REQUIRED_LV, it avoids the attack
              return;
            }
          }

          // Checks if the caster and the target are Characters and are within a non-PvP zone
          if (
            this.mapNonPVPZone.isNonPVPZoneAtXY(targetToHit.scene, targetToHit.x, targetToHit.y) ||
            this.mapNonPVPZone.isNonPVPZoneAtXY(caster.scene, caster.x, caster.y)
          ) {
            return;
          }

          // Check if the caster is in a party
          const casterParty: ICharacterParty | null = await CharacterParty.findOne({
            $or: [{ "leader._id": caster.id }, { "members._id": caster.id }],
          }).lean();

          if (casterParty) {
            // The caster is in a party, check if the target is as well
            const partyId = casterParty._id.toString();
            const targetParty: ICharacterParty | null = await CharacterParty.findOne({
              $or: [{ "leader._id": targetToHit.id }, { "members._id": targetToHit.id }],
            }).lean();
            if (targetParty) {
              const targetPartyId = targetParty._id.toString();
              // "Check if the party is the same
              if (partyId === targetPartyId) {
                return;
              }
            }
          }
        }

        // Checks if the attack is justified
        const isAttackUnjustified = this.characterSkull.checkForUnjustifiedAttack(
          caster as ICharacter,
          targetToHit as ICharacter
        );

        if (isAttackUnjustified) {
          // If the attack is not justified, the caster gains a 'skull'
          await this.characterSkull.updateWhiteSkull(caster.id, targetToHit.id);
        }
      }

      if (options?.customFn) {
        await options.customFn(targetToHit, targetIntensity);
      } else {
        await this.hitTarget.hit(caster, targetToHit, true, magicPower + targetIntensity, true);
      }

      if (options?.entityEffect) {
        await this.entityEffectUse.applyEntityEffects(targetToHit, caster, options.entityEffect);
      }
    });

    let animationPromises: Promise<void>[] = [];
    if (caster.type === EntityType.Character) {
      animationPromises = animationCells.map(async (animationCell) => {
        await this.animationEffect.sendAnimationEventToXYPosition(
          caster as ICharacter,
          effectAnimationKey,
          FromGridX(animationCell.x),
          FromGridY(animationCell.y)
        );
      });
    }

    if (caster.type === EntityType.NPC && target.type === EntityType.Character) {
      animationPromises = animationCells.map(async (animationCell) => {
        await this.animationEffect.sendAnimationEventToXYPosition(
          target as ICharacter,
          effectAnimationKey,
          FromGridX(animationCell.x),
          FromGridY(animationCell.y)
        );
      });
    }

    await Promise.all([...hitPromises, ...animationPromises]);
  }

  @TrackNewRelicTransaction()
  public async calculateEffect(
    caster: INPC | ICharacter,
    spellAreaOrigin: IPosition,
    spellAreaGrid: number[][],
    options?: ISpellAreaCalculateEffectOptions
  ): Promise<ISpellAreaEffect> {
    const animationCells: IPosition[] = [];
    const targets: IAffectedTarget[] = [];
    const centerX = spellAreaOrigin.x;
    const centerY = spellAreaOrigin.y;
    const gridLen = spellAreaGrid.length;
    const gridWidth = spellAreaGrid[0]?.length || 0;
    const halfGridWidth = Math.floor(gridWidth / 2);
    const halfGridLen = Math.floor(gridLen / 2);

    const promises: any[] = [];

    for (let i = 0; i < gridLen; i++) {
      for (let j = 0; j < gridWidth; j++) {
        const intensity = spellAreaGrid[i][j];
        if (intensity > 0) {
          const cellX = centerX + (j - halfGridWidth);
          const cellY = centerY + (i - halfGridLen);
          animationCells.push({ x: cellX, y: cellY });

          promises.push(
            this.getTarget({ x: cellX, y: cellY }, caster.layer, caster.scene).then((target) => {
              if (options?.includeCaster) {
                targets.push({ target: caster as any, intensity });
              }

              if (
                target &&
                target.id !== caster.id &&
                !options?.excludeEntityTypes.includes(target.type as EntityType)
              ) {
                /// avoid adding yourself
                targets.push({ target: target as any, intensity });
              }
            })
          );
        }
      }
    }

    await Promise.all(promises);

    return { cells: animationCells, targets };
  }

  @TrackNewRelicTransaction()
  private async getTarget(position: IPosition, layer: number, scene: string): Promise<ICharacter | INPC | undefined> {
    const commonQuery = {
      x: FromGridX(position.x),
      y: FromGridY(position.y),
      layer,
      health: { $gt: 0 },
      scene,
    };

    const [npc, char] = await Promise.all([
      NPC.findOne({ ...commonQuery }).lean({ virtuals: true, defaults: true }) as unknown as INPC,
      Character.findOne({ ...commonQuery, isOnline: true }).lean({
        virtuals: true,
        defaults: true,
      }) as unknown as ICharacter,
    ]);

    return npc || char;
  }
}
