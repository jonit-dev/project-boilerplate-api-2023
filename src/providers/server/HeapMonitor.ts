import { ROOT_PATH } from "@providers/constants/PathConstants";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import fs from "fs";
import v8 from "v8";

const MAX_HEAP_SIZE = 300 * 1024 * 1024;
const HEAP_CHECK_INTERVAL = 1000 * 60 * 10; // 10 minutes
const MAX_SNAPSHOTS = 2;

@provideSingleton(HeapMonitor)
export class HeapMonitor {
  private snapshotQty = 0;

  public monitor(): void {
    this.clearHeapsnapshots();

    setInterval(() => {
      const usedHeapSize = process.memoryUsage().heapUsed;

      if (usedHeapSize >= MAX_HEAP_SIZE && this.snapshotQty < MAX_SNAPSHOTS) {
        console.log("⚠️ Heap size exceeded, writing snapshot...");
        this.createSnapshot();
        this.snapshotQty++;
      }
    }, HEAP_CHECK_INTERVAL);
  }

  private clearHeapsnapshots(): void {
    const files = fs.readdirSync(`${ROOT_PATH}/logs`);

    for (const file of files) {
      if (file.endsWith(".heapsnapshot")) {
        const filePath = `${ROOT_PATH}logs/${file}`;
        fs.unlinkSync(filePath);
        console.log(`Deleted heap snapshot file: ${filePath}`);
      }
    }
  }

  private createSnapshot(): void {
    const snapshotStream = v8.getHeapSnapshot();
    // It's important that the filename end with `.heapsnapshot`,
    // otherwise Chrome DevTools won't open it.
    const fileName = `${ROOT_PATH}logs/${Date.now()}.heapsnapshot`;
    try {
      const fileStream = fs.createWriteStream(fileName);
      fileStream.on("finish", () => {
        console.log(`Heap snapshot saved to ${fileName}`);
      });
      snapshotStream.pipe(fileStream);
    } catch (err) {
      console.error(`Error writing heap snapshot to ${fileName}: ${err}`);
    }
  }
}
