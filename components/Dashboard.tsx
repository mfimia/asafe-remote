import React, { FC, useState } from 'react'
import PriceChart from './PriceChart'
import { CandleChartInterval, TradingPairSymbol } from '@/types'
import { useCandleData } from '@/hooks/useCandleData'
import VolumeChart from './VolumeChart'

const Dashboard: FC = () => {
  const [symbol, setSymbol] = useState<TradingPairSymbol>(TradingPairSymbol.BTCUSDT)
  const [timeframe, setTimeframe] = useState<CandleChartInterval>(CandleChartInterval.ONE_DAY)

  const { priceChartData, volumeData } = useCandleData(symbol, timeframe)

  /**
   * @todo
   * 1. Add loading spinner
   * 2. Add more graphs, use this component to pass them symbol, timeframe
   * 3. Add nice transitions/animations/interactions
   */

  return (
    <section>
      <fieldset>
        <label>Trading pair: </label>
        <select value={symbol} onChange={(e) => { setSymbol(e.target.value as TradingPairSymbol) }}>
          {Object.values(TradingPairSymbol).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </fieldset>
      <fieldset>
        <label>Timeframe: </label>
        <select value={timeframe} onChange={(e) => { setTimeframe(e.target.value as CandleChartInterval) }}>
          {Object.values(CandleChartInterval).map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </fieldset>
      <PriceChart data={priceChartData} />
      <VolumeChart data={volumeData} symbol={symbol} timeframe={timeframe} />
    </section>
  )
}

export default Dashboard