import { CRUD } from "@providers/mongoDB/MongoCRUDGeneric";
import { provide } from "inversify-binding-decorators";
import { IChatLogRepository } from "./IChatLogRepository";

@provide(ChatLogRepository)
export class ChatLogRepository extends CRUD implements IChatLogRepository {}
