import assert from "assert";
import { Container } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import "reflect-metadata";
import { GeckosMessaging } from "../GeckosMessaging";
import { GeckosServerHelper } from "../GeckosServerHelper";
import { connectedPlayersMock } from "./mocks/playersMock";

describe("GeckosMessaging", () => {
  let geckosMessaging: GeckosMessaging;

  beforeEach(() => {
    const container = new Container();
    container.load(buildProviderModule());

    geckosMessaging = container.get<GeckosMessaging>(GeckosMessaging);
  });
  // const geckosMessaging = container.get<GeckosMessaging>(GeckosMessaging);

  GeckosServerHelper.connectedPlayers = connectedPlayersMock;

  it("has connected players", () => {
    assert.ok(GeckosServerHelper.connectedPlayers);
  });

  it("it properly gets players on camera view", () => {
    const player1 = GeckosServerHelper.connectedPlayers["3a21121a-3d53-466e-831e-cdf1aac57c31"];

    const result = geckosMessaging.getPlayersOnCameraView(player1.id);

    // find another player that's under camera
    assert.ok(result.find((player) => player.name === "snake"));

    // do not find self in camera view
    assert.ok(!result.find((player) => player.name === "gopher"));

    // do not find a player who's far away

    assert.ok(!result.find((player) => player.name === "far-away-player"));
  });
});
