import { CandleChartInterval, TradingPairSymbol } from "@/types";
import ccxt, { OHLCV } from "ccxt";
import { useEffect, useState } from "react";

export interface IPriceChartData {
  price: number;
  timestamp: Date;
}

export const useCandleData = (symbol: TradingPairSymbol, timeframe: CandleChartInterval): { priceChartData: IPriceChartData[] } => {
  const [candleData, setCandleData] = useState<OHLCV[]>([])

  useEffect(() => {
    const fetchCandleData = async () => {
      const binance = new ccxt.binance();
      const ohlcv = await binance.fetchOHLCV(symbol, timeframe);

      setCandleData(ohlcv);
    };

    fetchCandleData();
  }, [symbol, timeframe]);

  return {
    priceChartData: candleData.map(candle => ({ price: candle[4]!, timestamp: new Date(candle[0]!) }))
  }
}
