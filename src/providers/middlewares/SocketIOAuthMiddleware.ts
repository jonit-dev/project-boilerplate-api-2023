import { IUser, User } from "@entities/ModuleSystem/UserModel";
import { appEnv } from "@providers/config/env";
import jwt from "jsonwebtoken";

export const SocketIOAuthMiddleware = async (socket, next): Promise<void | IUser> => {
  const authToken = socket.handshake.auth.token.split(" ")[1];

  if (!authToken) {
    next(new Error("Unauthorized"));
  }

  return await new Promise((resolve, reject) => {
    try {
      jwt.verify(authToken, appEnv.authentication.JWT_SECRET!, async (err, jwtPayload: any) => {
        if (err) {
          // here we associate the error to a variable because just throwing then inside this async block won't allow them to achieve the outside scope and be caught by errorHandler.middleware. That's why we're passing then to next...
          console.log(`Authorization error: Failed at JWT verification for ${jwtPayload.email}`);
          reject(next(new Error("Unauthorized")));
        }

        const dbUser = (await User.findOne({ email: jwtPayload.email })) as IUser;

        if (!dbUser) {
          console.log(`Authorization error: User not found (${jwtPayload.email})`);
          reject(next(new Error("Unauthorized")));
        }

        socket.handshake.userData = dbUser;

        resolve(dbUser);
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
