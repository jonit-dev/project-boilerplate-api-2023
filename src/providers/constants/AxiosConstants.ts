import { setupCache } from "axios-cache-adapter";

import { SHORT_CACHE_DURATION } from "./CacheConstants";

// Create `axios-cache-adapter` instance
export const axiosCache = setupCache({
  maxAge: SHORT_CACHE_DURATION,
  exclude: {
    query: false,
  },
});

// Risk: Low
// export const CRYPTOCOMPARE_AXIOS = axios.create({
//   baseURL: "https://min-api.cryptocompare.com",
//   adapter: axiosCache.adapter,
// });
