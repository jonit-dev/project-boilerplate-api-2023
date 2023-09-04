/* eslint-disable promise/always-return */
/* eslint-disable no-void */
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { EntityEffectUse } from "@providers/entityEffects/EntityEffectUse";
import { IEntityEffect } from "@providers/entityEffects/data/blueprints/entityEffect";
import { IPosition } from "@providers/movement/MovementHelper";
import {
  AnimationEffectKeys,
  EntityType,
  FromGridX,
  FromGridY,
  MagicPower,
  ToGridX,
  ToGridY,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { HitTarget } from "../../battle/HitTarget";

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
    private animationEffect: AnimationEffect
  ) {}

  @TrackNewRelicTransaction()
  public async cast(
    caster: ICharacter | INPC,
    target: ICharacter | INPC,
    magicPower: MagicPower,
    options: ISpellAreaCastOptions
  ): Promise<void> {
    const { spellAreaGrid, effectAnimationKey } = options;

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

    const hitPromises = targets.map(async (target) => {
      const targetToHit = target.target as unknown as ICharacter | INPC;
      const targetIntensity = target.intensity;

      if (options?.customFn) {
        await options.customFn(targetToHit, targetIntensity);
      } else {
        if (caster.type === EntityType.NPC && targetToHit.type === EntityType.NPC) {
          return; // avoid NPCs hitting each other
        }

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
