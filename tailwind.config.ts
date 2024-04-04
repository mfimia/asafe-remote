import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        twilight100: '#020c13',
        stardust60: '#e5e9ef',
        nebula100: '#b5c0f6',
        stardust100: '#d4dae4',
        supernebula: '#8799ff',
        twilight60: '#676d71',
        twilight80: '#353d42',
        supernova: '#f0f757',
        stardust40: '#eef0f4',
        space40: '#9a9eaf',
        twilight5: '#f2f3f3',
        ultranebula: '#637bff',
        meganebula: '#3050ff',
        space: '#010720',
        space100: '#020c36',
        space60: '#676d86',
        nebula90: '#bcc6f7',
        nebula80: '#c4cdf8',
        nebula70: '#cbd3f9',
        nebula60: '#d3d9fa',
        nebula50: '#dadffb',
        nebula40: '#e1e6fb',
        nebula30: '#e9ecfc',
        nebula20: '#f0f2fd',
        nebula1010: '#f9fafe',
        twilight90: '#181c1f',
        twilight70: '#353d42',
      },
      fontFamily: {
        tt: 'TT Hoves Pro',
        ubuntu: 'Ubuntu mono',
      },
    },
  },
  plugins: [],
}
export default config
