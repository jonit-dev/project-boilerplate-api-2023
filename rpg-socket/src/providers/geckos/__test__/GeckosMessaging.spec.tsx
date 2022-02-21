import "reflect-metadata";
import assert from "assert";
import { Container } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { GeckosMessaging } from "../GeckosMessaging";
import { GeckosServerHelper } from "../GeckosServerHelper";

describe("GeckosMessaging", () => {
  let geckosMessaging: GeckosMessaging;

  beforeEach(() => {
    const container = new Container();
    container.load(buildProviderModule());

    geckosMessaging = container.get<GeckosMessaging>(GeckosMessaging);
  });
  // const geckosMessaging = container.get<GeckosMessaging>(GeckosMessaging);

  GeckosServerHelper.connectedPlayers = {
    "3a21121a-3d53-466e-831e-cdf1aac57c31": {
      id: "3a21121a-3d53-466e-831e-cdf1aac57c31",
      channelId: "nCBmm4OkoSq6TksfKfNUsr9x",
      name: "gopher",
      x: 160,
      y: 192,
      direction: "down",
      isMoving: false,
      cameraCoordinates: { x: -64, y: 34.25, width: 470, height: 251.5 },
      otherPlayersInView: {},
    },
    "ad2b768c-0808-4b06-9b3f-306f3fd5ce76": {
      id: "ad2b768c-0808-4b06-9b3f-306f3fd5ce76",
      name: "snake",
      channelId: "nCBmm4OkoSq6TksfKfNUsr9x",
      x: 160,
      y: 192,
      direction: "down",
      isMoving: false,
      cameraCoordinates: { x: -64, y: 34.25, width: 470, height: 251.5 },
      otherPlayersInView: {},
    },
    "121231-0808-4b0s-9b3f-213112312": {
      id: "121231-0808-4b0s-9b3f-213112312",
      name: "far-away-player",
      channelId: "nCBmm4OkoSq6TksfKfNUsr9x",
      x: 99999,
      y: 99999,
      direction: "down",
      isMoving: false,
      cameraCoordinates: { x: 99999, y: 99999, width: 470, height: 251.5 },
      otherPlayersInView: {},
    },
  };

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
