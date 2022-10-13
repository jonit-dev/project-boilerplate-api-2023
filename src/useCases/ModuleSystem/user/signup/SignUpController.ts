import { IUser } from "@entities/ModuleSystem/UserModel";
import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { DTOValidatorMiddleware } from "@providers/middlewares/DTOValidatorMiddleware";
import { HttpStatus } from "@rpg-engine/shared";
import rateLimit from "express-rate-limit";
import { controller, httpPost, interfaces, request, requestBody, response } from "inversify-express-utils";
import { AuthSignUpDTO } from "../AuthDTO";
import { SignUpUseCase } from "./SignUpUseCase";

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limits this IP to only allow the creation of 10 accounts per minute
});

//! Reference:
//! Cloud setup: https://medium.com/the-dev-caf%C3%A9/log-in-with-google-oauth-2-0-node-js-and-passport-js-1f8abe096175 (ignore the passport part)
//! Logic: https://medium.com/@tomanagle/google-oauth-with-node-js-4bff90180fe6
@controller("/auth")
export class SignUpController implements interfaces.Controller {
  constructor(private signupUseCase: SignUpUseCase, private analyticsHelper: AnalyticsHelper) {}

  @httpPost("/signup", rateLimiter, DTOValidatorMiddleware(AuthSignUpDTO))
  public async signUp(@requestBody() authSignUpDTO, @request() req, @response() res): Promise<IUser> {
    const newUser = await this.signupUseCase.signUp(authSignUpDTO);

    await this.analyticsHelper.updateUserInfo(newUser);

    return res.status(HttpStatus.Created).send(newUser);
  }
}
