import { BadRequestError } from "@providers/errors/BadRequestError";
import { provide } from "inversify-binding-decorators";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

/* eslint-disable prefer-promise-reject-errors */
interface IAppleIdentityTokenResponse {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  c_hash: string;
  email: string;
  email_verified: string;
  auth_time: number;
  nonce_supported: boolean;
  real_user_status: number;
}

@provide(AppleOAuthHelper)
export class AppleOAuthHelper {
  public async verifyIdentityToken(identityToken: string): Promise<IAppleIdentityTokenResponse | null> {
    const json = jwt.decode(identityToken, { complete: true }) as any;

    if (json) {
      const keyId = json.header.kid;
      const applePublicKey = await this.getAppleSigningKey(keyId);

      if (!applePublicKey) {
        throw new BadRequestError("Oops! Something went wrong.");
      }

      const payload = this.verifyJWT(identityToken, applePublicKey);

      if (!payload) {
        throw new BadRequestError("Oops! Something went wrong.");
      }

      return payload;
    }

    return null;
  }

  private async getAppleSigningKey(kid: string): Promise<string | null> {
    const client = jwksClient({
      jwksUri: "https://appleid.apple.com/auth/keys",
    });

    return await new Promise((resolve, reject) => {
      client.getSigningKey(kid, (err, key) => {
        if (err) {
          console.log(err);
          reject(null);
        }

        const signingKey = key.getPublicKey();

        resolve(signingKey);
      });
    });
  }

  private verifyJWT(identityToken, publicKey): Promise<IAppleIdentityTokenResponse | null> {
    return new Promise((resolve, reject) => {
      jwt.verify(identityToken, publicKey, (err, payload) => {
        if (err) {
          console.log(err);
          return;
        }

        resolve(payload);
      });
    });
  }
}
