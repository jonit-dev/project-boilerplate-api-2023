export const appEnv = {
  ENV: process.env.ENV,
  port: {
    server: Number(process.env.SOCKET_SERVER_PORT),
    socket: Number(process.env.SOCKET_PORT),
  },
};
