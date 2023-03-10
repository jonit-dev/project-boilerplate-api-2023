import { DYNAMIC_MAP_DARKNESS } from "@providers/constants/MapConstants";
import { IMapMetaData, MapLighteningType } from "@rpg-engine/shared";

export const caveLightening: Partial<IMapMetaData> = {
  lightening: {
    type: MapLighteningType.Static,
    value: DYNAMIC_MAP_DARKNESS,
  },
};

export const exteriorLightening: Partial<IMapMetaData> = {
  lightening: {
    type: MapLighteningType.Dynamic,
  },
};
