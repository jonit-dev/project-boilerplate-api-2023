import { ITSDecorator, TsDefaultDecorator } from "@providers/constants/ValidationConstants";
import { CharacterController } from "@useCases/ModuleCharacter/character/CharacterController";
import { FactionController } from "@useCases/ModuleCharacter/faction/FactionController";
import { NPCController } from "@useCases/ModuleNPC/NPCController";
import { ABTestController } from "@useCases/ModuleSystem/abTests/ABTestController";
import { CacheController } from "@useCases/ModuleSystem/cache/CacheController";
import { ReadChatLogController } from "@useCases/ModuleSystem/chat/readChatLog/ReadChatLogController";
import { IndustriesController } from "@useCases/ModuleSystem/industries/IndustriesController";
import { MapController } from "@useCases/ModuleSystem/map/MapController";
import { PushNotificationController } from "@useCases/ModuleSystem/operation/pushNotification/PushNotificationController";
import { PlacesController } from "@useCases/ModuleSystem/places/PlacesController";
import { ScriptsController } from "@useCases/ModuleSystem/scripts/ScriptsController";
import { AppleOAuthController } from "@useCases/ModuleSystem/user/appleOAuth/AppleOAuthController";
import { ChangePasswordController } from "@useCases/ModuleSystem/user/changePassword/ChangePasswordController";
import { ForgotPasswordController } from "@useCases/ModuleSystem/user/forgotPassword/ForgotPasswordController";
import { GenerateGoogleOAuthUrlController } from "@useCases/ModuleSystem/user/generateGoogleOAuthUrl/GenerateGoogleOAuthUrlController";
import { GetGoogleUserController } from "@useCases/ModuleSystem/user/getGoogleUser/GetGoogleUserController";
import { GoogleOAuthSyncController } from "@useCases/ModuleSystem/user/googleOAuthSync/GoogleOAuthSyncController";
import { BasicEmailPwLoginController } from "@useCases/ModuleSystem/user/login/LoginController";
import { LogoutController } from "@useCases/ModuleSystem/user/logout/LogoutController";
import { OwnInfoUserController } from "@useCases/ModuleSystem/user/ownInfo/OwnInfoUserController";
import { RefreshController } from "@useCases/ModuleSystem/user/refreshToken/RefreshController";
import { SignUpController } from "@useCases/ModuleSystem/user/signup/SignUpController";
import { UnsubscribeUsercontroller } from "@useCases/ModuleSystem/user/unsubscribe/UnsubscribeUsercontroller";
import { UpdateUserController } from "@useCases/ModuleSystem/user/update/UpdateUserController";
import { ContainerModule, interfaces } from "inversify";
import { BlueprintController } from "@useCases/ModuleSystem/blueprint/BlueprintController";

export const userControllerContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
  bind<UpdateUserController>(UpdateUserController).toSelf();
  bind<ChangePasswordController>(ChangePasswordController).toSelf();
  bind<ForgotPasswordController>(ForgotPasswordController).toSelf();
  bind<GenerateGoogleOAuthUrlController>(GenerateGoogleOAuthUrlController).toSelf();
  bind<GetGoogleUserController>(GetGoogleUserController).toSelf();
  bind<BasicEmailPwLoginController>(BasicEmailPwLoginController).toSelf();
  bind<LogoutController>(LogoutController).toSelf();
  bind<OwnInfoUserController>(OwnInfoUserController).toSelf();
  bind<RefreshController>(RefreshController).toSelf();
  bind<SignUpController>(SignUpController).toSelf();
  bind<UnsubscribeUsercontroller>(UnsubscribeUsercontroller).toSelf();
  bind<GoogleOAuthSyncController>(GoogleOAuthSyncController).toSelf();
  bind<AppleOAuthController>(AppleOAuthController).toSelf();
  bind<PushNotificationController>(PushNotificationController).toSelf();
});

export const blueprintControllerContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
  bind<BlueprintController>(BlueprintController).toSelf();
});

export const dbTasksControllerContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {});

export const formControllerContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
  bind<IndustriesController>(IndustriesController).toSelf();
  bind<PlacesController>(PlacesController).toSelf();
});

export const abTestsControllerContainer = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
  bind<ABTestController>(ABTestController).toSelf();
});

export const useCasesControllers = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
  bind<ITSDecorator>("ITSDecorator").to(TsDefaultDecorator);
  bind<CharacterController>(CharacterController).toSelf();
  bind<NPCController>(NPCController).toSelf();
  bind<ReadChatLogController>(ReadChatLogController).toSelf();
  bind<MapController>(MapController).toSelf();
  bind<FactionController>(FactionController).toSelf();
  bind<CacheController>(CacheController).toSelf();
  bind<ScriptsController>(ScriptsController).toSelf();
});
