import { IsDefined, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

import { tsDefaultDecorator } from "../../../providers/constants/ValidationConstants";

export class AuthSignUpDTO {
  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  @MaxLength(50, tsDefaultDecorator("validation", "maxLength"))
  name: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  @MinLength(3, tsDefaultDecorator("validation", "minLength"))
  @MaxLength(50, tsDefaultDecorator("validation", "maxLength"))
  email: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  @MinLength(3, tsDefaultDecorator("validation", "minLength"))
  @MaxLength(50, tsDefaultDecorator("validation", "maxLength"))
  password: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  passwordConfirmation: string;

  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  @MinLength(3, tsDefaultDecorator("validation", "minLength"))
  @MaxLength(500, tsDefaultDecorator("validation", "maxLength"))
  address: string;

  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  @MinLength(3, tsDefaultDecorator("validation", "minLength"))
  @MaxLength(500, tsDefaultDecorator("validation", "maxLength"))
  phone: string;
}

export class AuthLoginDTO {
  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  email: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  password: string;
}

export class AuthRefreshTokenDTO {
  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  refreshToken: string;
}

export class AuthForgotPasswordDTO {
  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  email: string;
}

export class AuthChangePasswordDTO {
  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  currentPassword: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  newPassword: string;
}

export class AppleOAuthDTO {
  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  givenName: string;

  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  familyName: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  user: string;

  @IsOptional()
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  email: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  identityToken: string;

  @IsDefined(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsNotEmpty(tsDefaultDecorator("validation", "isNotEmpty"))
  @IsString(tsDefaultDecorator("validation", "isType", { type: "string" }))
  authorizationCode: string;
}
