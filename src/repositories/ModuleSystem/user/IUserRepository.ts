import { IUser } from "@entities/ModuleSystem/UserModel";

// Definitions of functions/properties that are exclusive for AssetRepository, not part of the CRUD
export interface IUserRepository {
  findUser(params: object): Promise<IUser>;
  signUp(newUserData): Promise<IUser>;
}
