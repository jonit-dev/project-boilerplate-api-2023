import * as routeCache from "route-cache";

import { MAX_ROUTE_CACHE_TIME_IN_SECONDS } from "../constants/ExpressConstants";

export const RouteCacheMiddleware = (timeInSeconds: number = MAX_ROUTE_CACHE_TIME_IN_SECONDS): any => {
  return routeCache.cacheSeconds(timeInSeconds);
};
