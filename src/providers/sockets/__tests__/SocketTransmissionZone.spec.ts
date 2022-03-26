import { container } from "@providers/inversify/container";
import { GRID_HEIGHT, GRID_WIDTH, SOCKET_TRANSMISSION_ZONE_WIDTH } from "@rpg-engine/shared";
import { SocketTransmissionZone } from "../SocketTransmissionZone";

describe("SocketTransmissionZone", () => {
  let socketTransmissionZone;

  beforeAll(() => {
    socketTransmissionZone = container.get<SocketTransmissionZone>(SocketTransmissionZone);
  });

  it("should correctly calculate the socket transmission zone area", () => {
    const { x, y, width, height } = socketTransmissionZone.calculateSocketTransmissionZone(
      144,
      128,
      GRID_WIDTH,
      GRID_HEIGHT,
      SOCKET_TRANSMISSION_ZONE_WIDTH,
      SOCKET_TRANSMISSION_ZONE_WIDTH
    );

    expect(x).toBe(-648);
    expect(y).toBe(-664);
    expect(width).toBe(936);
    expect(height).toBe(920);
  });
});
