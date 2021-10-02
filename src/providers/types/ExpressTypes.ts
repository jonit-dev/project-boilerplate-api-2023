import { Request } from "express";

import { IUser } from "../../entities/ModuleSystem/UserModel";

export interface IRequestCustom extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

export interface IAuthenticatedRequest extends IRequestCustom {
  user: IUser;
  ip: string;
}

export interface IServerBootstrapVars {
  appName: string;
  timezone: string;
  adminEmail: string;
  language: string;
  phoneLocale: string;
  port: string | number;
}
