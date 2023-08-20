import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { MarketplaceSocketEvents } from "@rpg-engine/shared";
import { MarketplaceGetPVPZone } from "../MarketplaceGetPVPZone";

describe("MarketplaceGetPVPZone.ts", () => {
  let marketplaceGetPVPZone: MarketplaceGetPVPZone;
  let testCharacter: ICharacter;

  const mockSocketMessaging = {
    sendEventToUser: jest.fn(),
    sendErrorMessageToCharacter: jest.fn(),
  };

  beforeEach(async () => {
    marketplaceGetPVPZone = container.get(MarketplaceGetPVPZone);

    // @ts-expect-error
    marketplaceGetPVPZone.socketMessaging = mockSocketMessaging;

    // Create test character
    testCharacter = await unitTestHelper.createMockCharacter(null, { hasEquipment: true, hasInventory: true });
    testCharacter.x = 1;
    testCharacter.y = 0;
    await testCharacter.save();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should send GetNonPVPZone event if character is in a non-PVP zone", async () => {
    // @ts-ignore
    marketplaceGetPVPZone.mapNonPVPZone.isNonPVPZoneAtXY = jest.fn().mockReturnValue(true);

    await marketplaceGetPVPZone.isNonPVPZone(testCharacter._id.toString());
    // @ts-ignore
    expect(mockSocketMessaging.sendEventToUser).toHaveBeenCalledWith(
      testCharacter.channelId!,
      MarketplaceSocketEvents.GetNonPVPZone,
      {
        isNonPVPZone: true,
      }
    );
  });

  it("should send an error message if character is not in a non-PVP zone", async () => {
    // @ts-ignore
    marketplaceGetPVPZone.mapNonPVPZone.isNonPVPZoneAtXY = jest.fn().mockReturnValue(false);

    await marketplaceGetPVPZone.isNonPVPZone(testCharacter._id.toString());

    const character = await Character.findById(testCharacter.id);

    // @ts-ignore
    expect(mockSocketMessaging.sendErrorMessageToCharacter).toHaveBeenCalledWith(
      character,
      "Sorry, you must be in a protected zone to use the marketplace"
    );
  });
});
