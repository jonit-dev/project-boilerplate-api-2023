export class TypeHelper {
  public static enumToStringArray(data: object): string[] {
    const enumKv = Object.entries(data).map(([key, value]) => ({ key, value }));

    const keys: string[] = [];

    enumKv.forEach((kv) => {
      if (typeof kv.value === "string") {
        keys.push(kv.value);
      }
    });

    return keys;
  }
}
