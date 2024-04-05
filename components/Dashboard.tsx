import 'tailwindcss/tailwind.css'

import React, { FC, useState } from 'react'
import PriceChart from './PriceChart'
import { CandleChartInterval, TradingPairSymbol } from '@/types'
import { useCandleData } from '@/hooks/useCandleData'
import VolumeChart from './VolumeChart'
import Loader from './Loader'

const Dashboard: FC = () => {
  const [symbol, setSymbol] = useState<TradingPairSymbol>(TradingPairSymbol.BTCUSDT)
  const [timeframe, setTimeframe] = useState<CandleChartInterval>(CandleChartInterval.ONE_DAY)

  const { priceChartData, volumeData, loading } = useCandleData(symbol, timeframe)

  return (
    <section className='flex flex-col gap-2 w-full p-4 m-2'>
      <fieldset className='border w-fit p-1'>
        <label>Trading pair: </label>
        <select value={symbol} onChange={(e) => { setSymbol(e.target.value as TradingPairSymbol) }}>
          {Object.values(TradingPairSymbol).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </fieldset>
      <fieldset className='border w-fit p-1'>
        <label>Timeframe: </label>
        <select value={timeframe} onChange={(e) => { setTimeframe(e.target.value as CandleChartInterval) }}>
          {Object.values(CandleChartInterval).map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </fieldset>
      <div className='flex flex-col gap-4 lg:flex-row mx-auto mt-4'>
        <div className='relative border w-[320px] h-[200px] sm:w-[480px] sm:h-[300px] xl:w-[600px] xl:h-[380px]'>
          {loading ? <Loader /> : <PriceChart data={priceChartData} symbol={symbol} />}
        </div>
        <div className='relative border w-[320px] h-[200px] sm:w-[480px] sm:h-[300px] xl:w-[600px] xl:h-[380px]'>
          {loading ? <Loader /> : <VolumeChart data={volumeData} symbol={symbol} />}
        </div>
      </div>
    </section>
  )
}

export default Dashboard