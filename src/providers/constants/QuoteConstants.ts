import { Currency, StockExchanges } from "@project-stock-alarm/shared/dist";

export const MAX_QUOTE_HISTORICAL_DATA_YEARS = 1;

export const stockExchangeCurrency = {
  [StockExchanges.BOVESPA]: Currency.BRL,
  [StockExchanges.NASDAQ]: Currency.USD,
  [StockExchanges.NYSE]: Currency.USD,
  [StockExchanges.CRYPTO]: Currency.USD,
};
