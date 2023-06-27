import { FullCRUD } from "@providers/mongoDB/FullCRUD";
import { provide } from "inversify-binding-decorators";
import { IChatLogRepository } from "./IChatLogRepository";

@provide(ChatLogRepository)
export class ChatLogRepository extends FullCRUD implements IChatLogRepository {}
