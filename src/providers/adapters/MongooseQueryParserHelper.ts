import { MongooseQueryParser, QueryOptions } from "mongoose-query-parser";

export class MongooseQueryParserHelper {
  public queryParser(query: Record<string, unknown>): QueryOptions {
    const parser = new MongooseQueryParser();
    const parsed = parser.parse(query);
    const filter: QueryOptions = parsed.filter;
    return filter;
  }
}
