import { FC } from 'react'

const Loader: FC = () => {
  return (
    <div className='absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center'>
      <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-b-ultranebula sm:h-16 sm:w-16 md:h-24 md:w-24 lg:h-28 lg:w-28 2xl:h-32 2xl:w-32'></div>
    </div>
  )
}

export default Loader
