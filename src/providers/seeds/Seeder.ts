import { provide } from "inversify-binding-decorators";

@provide(Seeder)
export class Seeder {
  constructor() {}

  //! Remove this line when using
  // eslint-disable-next-line require-await
  public async start(): Promise<void> {
    console.time("🌱 Seeding");
    // add seeders here
    console.timeEnd("🌱 Seeding");
  }
}
