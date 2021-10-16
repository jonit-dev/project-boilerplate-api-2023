import { createSchema, ExtractDoc, Type, typedModel } from "ts-mongoose";

const companySchema = createSchema(
  {
    user: Type.objectId({ ref: "User", required: true }),
    countryCode: Type.string(),
    city: Type.string(),
    name: Type.string({ required: true }),
    logo: Type.string(),
    workplaceValues: Type.array().of(Type.string()),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type ICompany = ExtractDoc<typeof companySchema>;

export const Company = typedModel("Company", companySchema);
