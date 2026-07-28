import type { AppProps } from 'next/app';
import '@Ai4x-All/chatui-core-private/dist/index.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
} 