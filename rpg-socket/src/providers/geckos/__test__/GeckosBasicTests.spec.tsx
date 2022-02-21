/* eslint-disable no-unused-vars */
// @ts-ignore

//! Not working yet! Need to figure out why .onConnection is not working!

import { GeckosServer, ServerChannel } from "@geckos.io/server";
import { jest } from "@jest/globals";
import assert from "assert";
import express from "express";
import http from "http";

let geckosChannel: ServerChannel;
let geckosIo: GeckosServer;
let server: http.Server;

// jest increase timeout
jest.setTimeout(30000);

beforeAll(async () => {
  const { geckos } = await import("@geckos.io/server");
  const app = express();
  server = http.createServer(app);
  geckosIo = geckos();
  geckosIo.listen(3000);
  geckosIo.addServer(server);
});

// beforeEach((done) => {
//   geckosIo.onConnection((channel) => {
//     geckosChannel = channel;
//     done();
//   });
// });

afterAll(() => {
  geckosIo.server.close();
  server.close();
  if (geckosChannel) {
    geckosChannel.close();
  }
});

describe("Geckos basic testing", () => {
  it("should have a geckosIO ready", () => {
    assert.ok(geckosIo);
  });
});
