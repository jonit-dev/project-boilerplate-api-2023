import axios from "axios";
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
export const CRYPTOCOMPARE_AXIOS = axios.create({
  baseURL: "https://min-api.cryptocompare.com",
  adapter: axiosCache.adapter,
});

//! Risk: High

export const GOOGLE_FINANCE = axios.create({
  baseURL: "https://www.google.com/finance",
  adapter: axiosCache.adapter,
});

// Risk: Low
export const COINCAP_AXIOS = axios.create({
  baseURL: "https://api.coincap.io/v2",
  adapter: axiosCache.adapter,
});

// Risk: low (feed RSS only)
export const INVESTING_AXIOS = axios.create({
  baseURL: "https://www.investing.com",
  adapter: axiosCache.adapter,
});

// Risk: Medium (News Scrapping)
export const ERESEARCH_FIDELITY = axios.create({
  baseURL: "https://eresearch.fidelity.com",
  adapter: axiosCache.adapter,
});

// Risk: Low
export const COINMARKETCAP_AXIOS = axios.create({ baseURL: "https://coinmarketcap.com/", adapter: axiosCache.adapter });

// Risk: Low
export const WIKIPEDIA_AXIOS = axios.create({
  baseURL: "https://en.wikipedia.org",
  adapter: axiosCache.adapter,
});

// Risk: Low
export const COINGECKO_API = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  adapter: axiosCache.adapter,
});

// Risk: Medium
export const IS_THIS_COIN_SCAM = axios.create({
  baseURL: "https://isthiscoinascam.com",
  adapter: axiosCache.adapter,
});

// Risk: Low
export const EXCHANGE_RATE_API = axios.create({
  baseURL: "https://v6.exchangerate-api.com/v6",
  adapter: axiosCache.adapter,
});

//! Risk: High (Exchange rate scrapping)
export const THE_MONEY_CONVERTER = axios.create({
  baseURL: "https://themoneyconverter.com",
  adapter: axiosCache.adapter,
});

// Risk: Low (occasional ticker scrapping for db seed)
export const INFOMONEY_API = axios.create({
  baseURL: "https://www.infomoney.com.br",
  adapter: axiosCache.adapter,
});

// Risk: Low
export const BRAPI_API = axios.create({
  baseURL: "https://brapi.ga/api",
  adapter: axiosCache.adapter,
});

// Risk: low
export const FMP_API = axios.create({
  baseURL: "https://financialmodelingprep.com/api/v3",
  adapter: axiosCache.adapter,
});
