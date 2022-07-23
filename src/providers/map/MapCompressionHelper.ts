import { compress } from "compress-json";
import fs from "fs";
import JSZip from "jszip";

export const createZipMap = async (mapName: string, mapObject: object, pathToSave: string): Promise<void> => {
  const data = compress(mapObject);
  const zip = new JSZip();
  zip.file(`${mapName}.txt`, JSON.stringify(data), {
    unixPermissions: "755",
  });
  const buffer = await zip.generateAsync({ type: "uint8array" });
  await fs.createWriteStream(`${pathToSave}/${mapName}.zip`).write(buffer);
};
