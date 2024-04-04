import { CandleChartInterval, TradingPairSymbol } from "@/types";
import ccxt, { OHLCV } from "ccxt";
import { useEffect, useState } from "react";

export interface IPriceChartData {
  price: number;
  timestamp: Date;
}

export interface IVolumeData {
  volume: number
  timestamp: Date
}

export const useCandleData = (symbol: TradingPairSymbol, timeframe: CandleChartInterval): { priceChartData: IPriceChartData[], volumeData: IVolumeData[], loading: boolean } => {
  const [candleData, setCandleData] = useState<OHLCV[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCandleData = async () => {
      try {
        setLoading(true)

        const binance = new ccxt.binance();
        const ohlcv = await binance.fetchOHLCV(symbol, timeframe);

        setCandleData(ohlcv);
      } catch (error) {
        alert('Error loading candle data')
      } finally {
        setLoading(false)
      }
    };

    fetchCandleData();
  }, [symbol, timeframe]);

  return {
    priceChartData: candleData.map(candle => ({ price: candle[4]!, timestamp: new Date(candle[0]!) })),
    volumeData: candleData.map(candle => ({ volume: candle[5]!, timestamp: new Date(candle[0]!) })),
    loading
  }
}
