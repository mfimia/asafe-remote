# Asafe MFE - remote

This is an MFE created with NextJS that is ready to use by a consumer application. It provides the code to display a dashboard that contains charts with crypto real data

## Project structure

- Built using NextJS v13 pages router (unfortunately there is no support for module federation on app router yet and v14 support is still flaky)
- Uses `TypeScript` and `TailwindCSS`
- Components
  - `Dashboard` - Allows the user to select timeframe and crypto currency to display in charts
  - `PriceChart` - Created with `D3.js`. It is a linear chart that displays price trend over a time period
  - `VolumeChart` - Created with `D3.js`. Histogram that displays volume data over a time period
  - `Loader` - Utility JSX to display loading state
- Hooks
- `useCandleData` - Fetches data from Binance api through `ccxt` and maps it for charts to consume
- `useContainerResize` - Observes resize event and returns an Element's ref with container dimensions
- `useDeepCompareEffect` - Extended version of [useEffect](https://react.dev/reference/react/useEffect) that performs a deep comparison in an array of elements using `lodash`

## Amazing, right? Here is how to use it:

### For development:

1. Ensure you have node and npm installed on your machine:

- [Node.js](https://nodejs.org/)
- npm

2. Clone the repository and install dependencies:

```sh
git clone https://github.com/mfimia/asafe-remote.git
cd asafe-remote
npm install
```

3. Spin up dev server

```sh
# To run the application in development mode:
npm run dev
# This will spin up the application on http://localhost:3001
```

4. Happy coding!

```sh
# To run all tests:
npm run test
```

### Deployment

The easiest way to deploy a Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the documentation [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details. It should be just a few clicks

> :warning: Your deployed code will not really render anything too useful. It will simply serve static JS files for a MFE host to consume

Made with ❤️ by [MF](https://github.com/mfimia)
