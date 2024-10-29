// pages/_app.tsx

import { AppProps } from 'next/app';
import Providers from "../provider/Provider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}