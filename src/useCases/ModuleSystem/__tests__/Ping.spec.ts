import { PingController } from "../ping/PingController";
import { Request, Response } from "express";

describe("PingController", () => {
  let pingController: PingController;

  beforeEach(() => {
    pingController = new PingController();
  });

  describe("pingServer", () => {
    it("should return a 200 status code for a valid request", () => {
      const req: Request = { params: { server: "server1" } } as any;
      const res: Response = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;
      pingController.pingServer(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
