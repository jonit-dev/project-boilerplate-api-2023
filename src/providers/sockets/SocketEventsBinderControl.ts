import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { provide } from "inversify-binding-decorators";
import { SocketEventsBinder } from "./SocketEventsBinder";

@provide(SocketEventsBinderControl)
export class SocketEventsBinderControl {
  constructor(private inMemoryHashTable: InMemoryHashTable, private socketEventsBinder: SocketEventsBinder) {}

  public async bindEvents(channel): Promise<void> {
    const hasBoundEvents = await this.inMemoryHashTable.has("channel-bound-events", channel.id.toString());

    if (hasBoundEvents) {
      return;
    }

    this.socketEventsBinder.bindEvents(channel);

    await this.inMemoryHashTable.set("channel-bound-events", channel.id.toString(), true);
  }

  public async unbindEvents(channel): Promise<void> {
    const hasBoundEvents = await this.inMemoryHashTable.has("channel-bound-events", channel.id.toString());

    if (!hasBoundEvents) {
      return;
    }

    channel.removeAllListeners();

    await this.inMemoryHashTable.delete("channel-bound-events", channel.id.toString());
  }
}
