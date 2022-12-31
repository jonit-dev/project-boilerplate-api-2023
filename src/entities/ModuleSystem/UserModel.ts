import { appEnv } from "@providers/config/env";
import { InternalServerError } from "@providers/errors/InternalServerError";
import { NotFoundError } from "@providers/errors/NotFoundError";
import { TS } from "@providers/translation/TranslationHelper";
import { IAuthResponse, TypeHelper, UserAuthFlow, UserTypes } from "@rpg-engine/shared";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";
import { ExtractDoc, Type, createSchema, typedModel } from "ts-mongoose";

const mongooseHidden = require("mongoose-hidden")();

const userSchema = createSchema(
  {
    name: Type.string(),
    role: Type.string({
      required: true,
      default: UserTypes.Regular,
      enum: TypeHelper.enumToStringArray(UserTypes),
    }),
    authFlow: Type.string({
      required: true,
      default: UserAuthFlow.Basic,
      enum: TypeHelper.enumToStringArray(UserAuthFlow),
    }),
    email: Type.string({ required: true, unique: true }),
    password: Type.string(),
    address: Type.string(),
    phone: Type.string(),
    salt: Type.string(),
    unsubscribed: Type.boolean({ default: false }),
    refreshTokens: Type.array().of({
      token: Type.string(),
    }),
    wallet: {
      publicAddress: Type.string(),
      networkId: Type.number(),
    },
    characters: Type.array().of(
      Type.objectId({
        ref: "Character",
      })
    ),

    // Static method types
    ...({} as {
      isValidPassword: (password: string) => Promise<boolean>;
      generateAccessToken: () => Promise<IAuthResponse>;
    }),
    pushNotificationToken: Type.string({ default: null }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

userSchema.plugin(uniqueValidator);

export type IUser = ExtractDoc<typeof userSchema>;

//  Hidden fields (not exposed through API responses)
userSchema.plugin(mongooseHidden, {
  hidden: {
    _id: false,
    password: true,
    salt: true,
    refreshTokens: true,
    createdAt: true,
    updatedAt: true,
  },
});

// Hooks ========================================

userSchema.pre("save", async function (next): Promise<void> {
  // @ts-ignore
  const user = this as IUser;
  const salt = await bcrypt.genSalt();

  if (user.isModified("password")) {
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    user.salt = salt;
    next();
  }
});
userSchema.methods.isValidPassword = async function (providedPassword: string): Promise<boolean> {
  const user = this as IUser;

  const comparisonHash = await bcrypt.hash(providedPassword, user.salt!);

  return comparisonHash === user.password;
};

userSchema.methods.generateAccessToken = async function (): Promise<IAuthResponse> {
  const user = this as IUser;

  const accessToken = jwt.sign(
    { _id: user._id, email: user.email },
    appEnv.authentication.JWT_SECRET!
    // { expiresIn: "20m" }
  );
  const refreshToken = jwt.sign({ _id: user._id, email: user.email }, appEnv.authentication.REFRESH_TOKEN_SECRET!);

  user.refreshTokens = [...user.refreshTokens!, { token: refreshToken }];

  await user.save();

  return {
    accessToken,
    refreshToken,
  };
};

export const User = typedModel("User", userSchema, undefined, undefined, {
  // Static methods ========================================
  checkIfExists: async (email: string): Promise<boolean> => {
    const exists = await User.findOne({ email });

    if (exists) {
      return true;
    }

    return false;
  },
  findByCredentials: async (email: string, password: string) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new NotFoundError(TS.translate("users", "userNotFound"));
    }

    // check if user was created using Basic UserAuthFlow (this route is only for this!)

    if (user.authFlow !== UserAuthFlow.Basic) {
      throw new InternalServerError(TS.translate("auth", "authModeError"));
    }

    const isValidPassword = await user.isValidPassword(password);

    if (isValidPassword) {
      return user;
    }

    return false;
  },
});
